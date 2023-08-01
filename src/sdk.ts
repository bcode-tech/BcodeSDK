//Libraries
import axios from "axios";
import { ethers, Wallet } from "ethers";
import { pick, range } from "lodash";
import w3Abi, { AbiCoder } from "web3-eth-abi";
import { MerkleTree } from "merkletreejs";

//Utils
import { getTransactionData } from "./common/utils";
import { logger } from "./common/logger";

//Constants
import { ERROR_TYPE, IPFS_GATEWAY, BCODE_NFT_OBJ } from "./common/constants";

//Abis
import BcodeToken from "./common/abis/BcodeToken";
import BcodeNFT from "./common/abis/BcodeNFT";

//Config
import config from "./config";

//Types
import {
  SdkOptions,
  ContractStruct,
  Optionals,
  MetaTransaction,
  ReturnParam,
  BcodeContractsObj,
} from "./types";

function getWeb3Abi(w3Abi: unknown): AbiCoder {
  return w3Abi as AbiCoder;
}

const web3Abi = getWeb3Abi(w3Abi);

export default class BcodeSDK {
  apiKey?: string;
  wallet?: Wallet | null;
  provider?: any;
  authToken?: string;
  env: string;
  endpoint: string;
  rpcProvider: string;
  initialized: boolean;
  contracts: BcodeContractsObj | {};

  constructor(sdkOptions: SdkOptions) {
    this.initialized = false;
    if (!sdkOptions.config?.debugMode) {
      logger.transports[0].silent = true;
    }

    this.env = sdkOptions.config?.env || "MUMBAI";
    this.endpoint =
      sdkOptions.config?.endpoint || config[`ENDPOINT_${this.env}`];
    this.rpcProvider =
      sdkOptions.config?.rpcProvider || config[`RPC_PROVIDER_${this.env}`];

    logger.info(`Working environment: ${this.env}`);
    // logger.info("RPC Provider ", this.rpcProvider);

    if (sdkOptions.apiKey) {
      this.apiKey = sdkOptions.apiKey;
    } else if (sdkOptions.authToken) {
      this.authToken = sdkOptions.authToken;
    } else {
      console.error(
        "[Error] API key or auth token are required, please insert one!"
      );
    }

    // this.network = sdkOptions.config?.network || "MUMBAI";
    this.provider = new ethers.providers.JsonRpcProvider(this.rpcProvider);

    if (sdkOptions.privateKey) {
      this.wallet = new ethers.Wallet(sdkOptions.privateKey);
    } else {
      this.wallet = ethers.Wallet.createRandom();
    }

    this.contracts = {
      ...sdkOptions.config.bcodeContracts,
    };

    logger.info("Finished initialization");
  }

  /**
   * Need to called once after calling constructor
   */
  async init() {
    try {
      if (this.apiKey) {
        let { status, data } = await axios.get(
          `${this.endpoint}/generateJWT/${this.apiKey}/${this.wallet!.address}`
        );
        if (status === 200) {
          logger.info("Auth token received ");

          this.authToken = data.authToken;

          this.contracts = {
            ...(await axios.get(`${this.endpoint}/contracts`)).data,
            ...this.contracts,
          };
        } else {
          logger.error(`[Init] Error: ${status}`);
          throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
        }
      } else if (this.authToken) {
        this.checkJWTValidity();
      }
      this.initialized = true;
    } catch (error) {
      logger.info("[Error] ", error);
      throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
    }
  }

  setPrivateKey(privateKey: string) {
    this.wallet = new ethers.Wallet(privateKey);
    logger.info("New wallet setted from private key!");
  }

  connect(provider: ethers.providers.Provider) {
    this.provider = provider;
    this.wallet?.connect(this.provider);
  }

  setMnemonicPhrase(mnemonic: string) {
    this.wallet = ethers.Wallet.fromMnemonic(mnemonic);
    logger.info("New wallet setted from mnemonic!");
  }

  resetWallet() {
    this.wallet = null;
    logger.info("Wallet resetted!");
  }

  regenerateWallet() {
    this.wallet = ethers.Wallet.createRandom();
    logger.info("Wallet regenerated!");
  }

  isInitialized() {
    return this.initialized;
  }

  getBcodeContracts(): BcodeContractsObj | {} {
    return this.contracts;
  }

  /**
   * Return JWT token
   *
   * @returns authToken
   */
  getAuthToken() {
    logger.info(`Your auth token is: ${this.authToken}`);

    if (this.authToken) {
      return this.authToken;
    } else {
      console.error(
        "[Error] run sdk.init() if you don't already do that, otherwise check if your API key is correct"
      );
      return null;
    }
  }

  /**
   * Return apiKey added in contructor
   *
   * @returns apiKey
   */
  getApiKey() {
    logger.info(`Your API key is: ${this.apiKey}`);
    return this.apiKey;
  }

  /**
   * Return address of wallet associated in current instance
   *
   * @returns wallet address
   */
  getWalletAddress() {
    return this.wallet!.address;
  }

  /**
   * Return wallet private key
   *
   * @returns privateKey
   */
  getPrivateKey() {
    return this.wallet!.privateKey;
  }

  /**
   * This function helps to check BcodeToken (PTK)
   *
   * @param address
   * @returns balance - string
   */
  async getBcodeTokenBalance(address = this.wallet!.address) {
    const bcodeToken = new ethers.Contract(
      this.contracts[`PABLOCK_TOKEN_ADDRESS`],
      BcodeToken.abi,
      this.provider
    );

    const balance = parseInt(
      ethers.utils.formatEther(await bcodeToken.balanceOf(address))
    );

    logger.info(`User has ${balance} PTK`);
    return balance;
  }

  /**
   * This function return MATIC balance of the user wallet by default, otherwise, returns
   * the balance of specified wallet
   *
   * @param address
   * @returns number
   */
  async getMaticBalance(address = this.wallet!.address) {
    const balance = parseInt(
      (await this.provider.getBalance(address)).toString()
    );

    logger.info(`User has ${balance} MATIC`);
    return balance;
  }

  async requestTestPTK() {
    logger.info(`Request 10 PTK for test from ${this.wallet!.address}`);

    let { status, data } = await axios.get(
      `${this.endpoint}/faucet/${this.wallet!.address}`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    logger.info(`Request token status: ${status}`);

    return data;
  }

  /**
   * Request token of contract for user
   *
   * @param amount
   * @param contractAddress
   * @returns request response
   */
  async requestToken(amount: number, contractAddress: string) {
    if (this.env === "MUMBAI") {
      logger.info(`Request ${amount} token from ${this.wallet!.address}`);

      let { status, data } = await axios.post(
        `${this.endpoint}/mintToken`,
        { contractAddress, to: this.wallet!.address, amount },
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      logger.info(`Request token status: ${status}`);
    } else {
      logger.error("[BcodeSDK] Token can only be requested for MUMBAI network");
    }
  }

  /**
   * Function that allows user to mintNFT from BcodeNFT contract or other contract if specified
   * The specified contract must be Bcode-compatible
   *
   * @param amount
   * @param uri
   * @param contractAddress
   * @param webhookUrl
   * @returns
   */
  async mintBcodeNFT(amount: number, uri: string, optionals: Optionals) {
    try {
      const tx: MetaTransaction = await this.prepareTransaction(
        { ...BCODE_NFT_OBJ, address: this.contracts[`PABLOCK_NFT`] },
        "mintToken",
        [this.wallet!.address, amount, uri]
      );

      const receipt = await this.executeTransaction(tx, optionals);

      return receipt;
    } catch (err) {
      logger.error(`NFTMint error: ${err} `);
      return null;
    }
  }

  /**
   * This function set allowance and permit Bcode Address to transfer the NFT to the set receiver address
   *
   * @param to
   * @param tokenId
   * @param deadline
   * @param contractAddress
   * @returns
   */
  async sendBcodeNFT(to: string, tokenId: number, optionals: Optionals) {
    try {
      const tx: MetaTransaction = await this.prepareTransaction(
        { ...BCODE_NFT_OBJ, address: this.contracts[`PABLOCK_NFT`]! },
        "transferFrom",
        [this.wallet!.address, to, tokenId]
      );

      const receipt = await this.executeTransaction(tx, optionals);

      return receipt;
    } catch (err) {
      logger.error(`NFTTransfer error: ${err} `);
      return null;
    }
  }

  /**
   * This function allow the creation of a meta transaction compatible signature.
   * The result of this function needs to be passed to executeTransaction
   *
   * @param contractObj
   * @param functionName
   * @param params
   * @param optionals
   * @returns Transactin Object
   */
  async prepareTransaction(
    contractObj: ContractStruct,
    functionName: string,
    params: Array<any>,
    optionals?: { nonce: number }
  ): Promise<MetaTransaction> {
    logger.info(`[Prepare Transaction]`);
    logger.info(
      `${contractObj.address}\n${contractObj.name}\n${contractObj.version}\n${functionName}`
    );

    let functionSignature = web3Abi.encodeFunctionCall(
      contractObj.abi.find(
        (el) => el.type === "function" && el.name === functionName
      ),
      params
    );

    const metaTxContract = this.getContract(
      this.contracts[`PABLOCK_META_TRANSACTION`],
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "getNonce",
          outputs: [
            {
              internalType: "uint256",
              name: "nonce",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ]
    );
    /**
     * Allow user to send more transaction at once by specifing future nonce
     */
    let nonce = optionals?.nonce || 0;
    if (!optionals?.nonce) {
      nonce = await metaTxContract.getNonce(this.wallet!.address);
    }

    logger.info(`[Prepare Transaction] Nonce: ${nonce}`);

    // const { data } = await axios.get(
    //   `${this.endpoint}/getNonce/${this.wallet!.address}`,
    //   {
    //     headers: { Authorization: `Bearer ${this.authToken}` },
    //   }
    // );

    let { r, s, v } = await getTransactionData(
      nonce,
      functionSignature,
      this.wallet!.address,
      this.wallet!.privateKey,
      {
        name: contractObj.name,
        version: contractObj.version,
        address: contractObj.address,
        // chainId: (await this.provider.getNetwork()).chainId,
        chainId: config[`CHAIN_ID_${this.env}`],
      }
    );
    logger.info("[Prepare Transaction] Success");

    return {
      contractAddress: contractObj.address,
      userAddress: this.wallet!.address,
      functionSignature,
      r: `0x${r.toString("hex")}`,
      s: `0x${s.toString("hex")}`,
      v,
    };
  }

  /**
   * Send meta transaction signature to Bcode API to be processed.
   *
   * @param tx
   * @param optionals
   * @returns Request id
   */
  async executeTransaction(
    tx: MetaTransaction,
    optionals: Optionals
  ): Promise<string | null> {
    return await this.executeAsyncTransaction(tx, optionals);
  }

  /**
   * Send meta transaction signature to Bcode API to be processed.
   *
   * @param tx
   * @param optionals
   * @returns Request id
   */
  async executeAsyncTransaction(
    tx: MetaTransaction,
    optionals?: Optionals
  ): Promise<string | null> {
    try {
      const { status, data } = await axios.post(
        `${this.endpoint}/sendRawTransactionAsync`,
        {
          tx,
          ...optionals,
        },
        { headers: { Authorization: `Bearer ${this.authToken}` } }
      );

      if (status === 200) {
        logger.info("[Execute Async Transaction] Success");
        return data.requestId;
      } else {
        logger.info(`[Execute Async Transaction] Receive status: ${status}`);
        return null;
      }
    } catch (err) {
      logger.error(`[Execute Async Transaction] Error: ${err}`);
      return null;
    }
  }

  /**
   * Request hash notarization to Bcode API
   *
   * @param hash
   * @param optionals
   * @returns Request id
   */
  async notarizeHash(hash: string, optionals?: Optionals) {
    try {
      const { status, data } = await axios.post(
        `${this.endpoint}/notarize`,
        {
          hash,
          ...optionals,
        },
        { headers: { Authorization: `Bearer ${this.authToken}` } }
      );
      if (status === 200) {
        return data.requestId;
      } else {
        logger.error(`Notarization error, status code ${status} `);
      }
    } catch (err) {
      logger.error(`Notarization error: ${err} `);
      return null;
    }
  }

  /**
   * Check status of a notarization merkle tree data based on requested id
   *
   * @param requestId
   * @param returnParams
   * @returns
   */
  async checkBundledNotarization(
    requestId: string,
    returnParams: ReturnParam[]
  ) {
    let {
      status,
      data: { hash, ipfsMerkleTree },
    } = await axios.get(`${this.endpoint}/checkNotarizationTree/${requestId}`, {
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    let { data: leaves } = await axios.get(`${IPFS_GATEWAY}/${ipfsMerkleTree}`);

    let merkleTree = new MerkleTree(leaves.map((leaf: string) => leaf));
    const merkleRoot = merkleTree.getHexRoot();

    const merkleProof = merkleTree.getProof(hash);
    const inclusion = merkleTree.verify(merkleProof, hash, merkleRoot);

    return returnParams.length
      ? pick(
          {
            leaves,
            merkleRoot,
            hash,
            merkleProof,
            inclusion,
          },
          returnParams
        )
      : {
          leaves,
          merkleRoot,
          hash,
          merkleProof,
          inclusion,
        };
  }

  /**
   * Check status of a notarization based on requested id
   *
   * @param requestId
   * @returns
   */
  async checkStatus(requestId: string) {
    const { data } = await axios.get(
      `${this.endpoint}/checkStatus/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    return data;
  }

  /**
   * Check status of a meta transaction based on requested id
   *
   * @param requestId
   * @returns
   */
  async checkMetaTxStatus(requestId: string) {
    const { data } = await axios.get(
      `${this.endpoint}/getMetaTxStatus/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    return data;
  }

  /**
   * Build and return ethers Contract object
   * @param address
   * @param abi
   * @returns ethers.Contract object
   */
  getContract(address: string, abi: any[]) {
    return new ethers.Contract(
      address,
      abi,
      this.wallet?.connect(this.provider)
    );
  }

  /**
   * Return nonce of meta transaction contract, different from blockchain nonce
   *
   * @param address
   * @returns
   */
  async getNonce(address: string) {
    const metaTxContract = this.getContract(
      this.contracts[`PABLOCK_META_TRANSACTION`],
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "user",
              type: "address",
            },
          ],
          name: "getNonce",
          outputs: [
            {
              internalType: "uint256",
              name: "nonce",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ]
    );

    return await metaTxContract.getNonce(address);
  }

  /**
   * This functions outputs the NFT tokens, owned by the user, of the contract addresses given through the input
   *
   * @param contractAddresses
   * @param ownerAddress
   * @returns Object with contract addresses as keys and NFT arrays as value
   */
  async getOwnedNFT(
    contractAddresses: string[],
    ownerAddress = this.wallet!.address
  ) {
    let tokenOfOwner = {};

    for (const addr of contractAddresses) {
      let contract = new ethers.Contract(
        addr,
        BcodeNFT.abi,
        this.wallet!.connect(this.provider)
      );

      let balance = await contract.balanceOf(ownerAddress);

      logger.info(`User has ${balance} NFTs in ${addr} contract`);
      let tokenIds: { tokenId: string; tokenURI: string }[] = [];
      for (const i of range(balance)) {
        const tokenId = await contract.tokenOfOwnerByIndex(ownerAddress, i);

        // logger.info(`Token: ${await contract.baseURI()}`);

        // tokenOfOwner[addr] = parseInt(tokenId.values.toString());
        tokenIds.push({
          tokenId: tokenId.toString(),
          tokenURI: await contract.tokenURI(tokenId.toString()),
        });
      }

      tokenOfOwner[addr] = tokenIds;
      // logger.info(`User own from ${addr}: ${tokenOfOwner[addr]}`);
    }

    return tokenOfOwner;
  }

  /**
   * Check if JWT Token is still valid
   *
   * @returns boolean
   */
  async checkJWTValidity() {
    try {
      let { status, data } = await axios.get(`${this.endpoint}/checkJWT`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      });

      logger.info(`AUTHENTICATION ==> ${status} ${JSON.stringify(data)}`);

      return data.auth;
    } catch (error) {
      throw ERROR_TYPE.UNABLE_TO_CHECK_TOKEN;
    }
  }

  /**
   * @description Generate a sub JWT thatt can interact with Bcode API
   * @param address
   * @returns
   */
  async generateSubJWT(address: string) {
    try {
      let { status, data } = await axios.get(
        `${this.endpoint}/generateSubJWT/${address}`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      console.log(data);
      logger.info(`SubJWT: ${data.authToken}`);

      return data.authToken;
    } catch (error) {
      throw ERROR_TYPE.UNABLE_TO_GENERATE_SUB_JWT;
    }
  }

  /**
   * Return API version
   *
   * @returns string
   */
  async getAPIVersion() {
    let { data } = await axios.get(`/getVersion`);
    return data;
  }
}
