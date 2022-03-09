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
import {
  ERROR_TYPE,
  IPFS_GATEWAY,
  PABLOCK_NFT_OBJ,
  PABLOCK_NOTARIZATION_OBJ,
} from "./common/constants";

//Abis
import CustomERC20 from "./common/abis/CustomERC20";
import PablockToken from "./common/abis/PablockToken";
import PablockNFT from "./common/abis/PablockNFT";
import PablockNotarization from "./common/abis/PablockNotarization";

//Config
import config from "./config";

//Types
import {
  SdkOptions,
  ContractStruct,
  Optionals,
  MetaTransaction,
  ReturnParam,
  PablockContractsObj,
} from "./types";

function getWeb3Abi(w3Abi: unknown): AbiCoder {
  return w3Abi as AbiCoder;
}

const web3Abi = getWeb3Abi(w3Abi);

export class PablockSDK {
  apiKey?: string;
  wallet?: Wallet;
  provider?: any;
  authToken?: string;
  env: string;
  endpoint: string;
  rpcProvider: string;
  initialized: boolean;
  contracts: PablockContractsObj | {};

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
      ...sdkOptions.config.pablockContracts,
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
    logger.info("New wallet setted!");
  }

  isInitialized() {
    return this.initialized;
  }

  getPablockContracts(): PablockContractsObj | {} {
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

  getWallet() {
    return this.wallet;
  }

  getPrivateKey() {
    return this.wallet!.privateKey;
  }

  /**
   * This function helps to check PablockToken (PTK)
   *
   * @param address
   * @returns balance - string
   */
  async getPablockTokenBalance(address = this.wallet!.address) {
    const pablockToken = new ethers.Contract(
      this.contracts[`PABLOCK_TOKEN_ADDRESS`],
      PablockToken.abi,
      this.provider
    );

    const balance = parseInt(
      ethers.utils.formatEther(await pablockToken.balanceOf(address))
    );

    logger.info(`User has ${balance} PTK`);
    return balance;
  }

  async getTokenBalance(
    contractAddress = config[`CUSTOM_TOKEN_ADDRESS_${this.env}`],
    address = this.wallet!.address
  ) {
    try {
      const customToken = new ethers.Contract(
        contractAddress,
        CustomERC20.abi,
        this.provider
      );

      const balance = parseInt(
        ethers.utils.formatEther(await customToken.balanceOf(address))
      );

      logger.info(`User has ${balance} ${await customToken.name()}`);
      return balance;
    } catch (err) {
      logger.error("[Pablock API] Custom token balance: ", err);
      throw ERROR_TYPE.CONTRACT_ERROR;
    }
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

    return data;
  }

  /**
   * Function that allows user to mintNFT from PablockNFT contract or other contract if specified
   * The specified contract must be Pablock-compatible
   *
   * @param amount
   * @param uri
   * @param contractAddress
   * @param webhookUrl
   * @returns
   */
  async mintPablockNFT(
    amount: number,
    uri: string,
    optionals: Optionals | null
  ) {
    try {
      const tx: MetaTransaction = await this.prepareTransaction(
        { ...PABLOCK_NFT_OBJ, address: this.contracts[`PABLOCK_NFT`] },
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
   * This function set allowance and permit Pablock Address to transfer the NFT to the set receiver address
   *
   * @param to
   * @param tokenId
   * @param deadline
   * @param contractAddress
   * @returns
   */
  async sendPablockNFT(
    to: string,
    tokenId: number,
    optionals: Optionals | null
  ) {
    try {
      const tx: MetaTransaction = await this.prepareTransaction(
        { ...PABLOCK_NFT_OBJ, address: this.contracts[`PABLOCK_NFT`]! },
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

  async prepareTransaction(
    contractObj: ContractStruct,
    functionName: string,
    params: Array<any>
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

    const nonce = await metaTxContract.getNonce(this.wallet!.address);
    logger.info(`[Prepare Transactin] Nonce: ${nonce}`);

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

  async executeTransaction(tx: MetaTransaction, optionals: Optionals | null) {
    try {
      const { status, data } = await axios.post(
        `${this.endpoint}/sendRawTransaction`,
        {
          tx,
          ...optionals,
        },
        { headers: { Authorization: `Bearer ${this.authToken}` } }
      );
      if (status === 200) {
        logger.info("[Execute Transaction] Success");
        return data.tx;
      } else {
        logger.info(`[Execute Transaction] Receive status: ${status}`);
        return null;
      }
    } catch (err) {
      logger.error(`[Execute Transaction] Error: ${err}`);
      return null;
    }
  }

  async executeAsyncTransaction(tx: MetaTransaction, optionals: Optionals) {
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

  // async notarizeHash(
  //   hash: string,
  //   uri: string,
  //   appId: string,
  //   optionals: Optionals | null
  // ) {
  //   try {
  //     const tx = await this.prepareTransaction(
  //       {
  //         ...PABLOCK_NOTARIZATION_OBJ,
  //         address: this.contracts[`PABLOCK_NOTARIZATION`],
  //       },
  //       "notarize",
  //       [hash, uri, this.wallet!.address, appId]
  //     );

  //     console.log("TX ==>", tx);

  //     const receipt = await this.executeTransaction(tx, optionals);

  //     return receipt;
  //   } catch (err) {
  //     logger.error(`Notarization error: ${err} `);
  //     return null;
  //   }
  // }

  async notarizeHash(hash: string, optionals: Optionals) {
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

  async getMetaTxStatus(requestId: string) {
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

  getContract(address: string, abi: any[]) {
    return new ethers.Contract(
      address,
      abi,
      this.wallet?.connect(this.provider)
    );
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
        PablockNFT.abi,
        this.wallet!.connect(this.provider)
      );

      let balance = await contract.balanceOf(ownerAddress);

      logger.info(`User has ${balance} NFTs in ${addr} contract`);
      let tokenIds = [];
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

      logger.info(status, data);

      return data.auth;
    } catch (error) {
      throw ERROR_TYPE.UNABLE_TO_CHECK_TOKEN;
    }
  }

  /**
   * @description Generate a sub JWT thatt can interact with Pablock API
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

export * as Hash from "./modules/hash"
export * as QRCode from "./modules/qrcode"
