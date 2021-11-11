//Libraries
import axios from "axios";
import { ethers, Wallet, BigNumber, ContractInterface } from "ethers";
import { range } from "lodash";
import web3Abi from "web3-eth-abi";

//Utils
import { sign, getPermitDigest, getTransactionData } from "./common/utils";
import { logger } from "./common/logger";

//Constants
import { ERROR_TYPE } from "./common/constants";

//Abis
import CustomERC20 from "./common/abis/CustomERC20";
import PablockToken from "./common/abis/PablockToken";
import PablockNFT from "./common/abis/PablockNFT";
import PablockNotarization from "./common/abis/PablockNotarization";

//Config
import config from "./config";

type Configuration = {
  env: "LOCAL" | "MUMBAI" | "POLYGON";
  debugMode: boolean | false;
};

type SdkOptions = {
  apiKey: string;
  authToken?: string;
  privateKey: string;
  config: Configuration;
};

type ContractStruct = {
  address: string;
  abi: Array<any>;
  name: string;
  version: string;
};

export class PablockSDK {
  apiKey?: string;
  wallet?: Wallet;
  provider?: any;
  authToken?: string;
  env: string;

  constructor(sdkOptions: SdkOptions) {
    if (!sdkOptions.config?.debugMode) {
      logger.transports[0].silent = true;
    }

    this.env = sdkOptions.config?.env || "MUMBAI";

    logger.info(`Working environment: ${this.env}`);
    // logger.info("RPC Provider ", config[`RPC_PROVIDER_${this.env}`]);

    if (sdkOptions.apiKey) {
      this.apiKey = sdkOptions.apiKey;
    } else if (sdkOptions.authToken) {
      this.authToken = sdkOptions.authToken;
    } else {
      console.error(
        "[Error] API key or auth token are required, please insert one!"
      );
      process.exit(1);
    }

    // this.network = sdkOptions.config?.network || "MUMBAI";
    this.provider = new ethers.providers.JsonRpcProvider(
      config[`RPC_PROVIDER_${this.env}`]
    );

    if (sdkOptions.privateKey) {
      this.wallet = new ethers.Wallet(sdkOptions.privateKey);
    } else {
      this.wallet = ethers.Wallet.createRandom();
    }

    logger.info("Finished initialization");
  }

  /**
   * Need to called once after calling constructor
   */
  async init() {
    try {
      if (this.apiKey) {
        let { status, data } = await axios.get(
          `${config[`ENDPOINT_${this.env}`]}/generateJWT/${this.apiKey}/${
            this.wallet!.address
          }`
        );
        if (status === 200) {
          // logger.info("Auth token received ", data.authToken);

          this.authToken = data.authToken;
        } else {
          throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
        }
      } else if (this.authToken) {
        this.checkJWTValidity();
      }
    } catch (error) {
      logger.info("[Error] ", error);
      throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
    }
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
   * This function helps to check PablockToken (PTK)
   *
   * @param address
   * @returns balance - string
   */
  async getPablockTokenBalance(address = this.wallet!.address) {
    const pablockToken = new ethers.Contract(
      config[`PABLOCK_TOKEN_ADDRESS_${this.env}`],
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

  /**
   * This function allows the user to set the allowance to a user over his token
   *
   * @param contractAddress
   * @param spender
   * @param value
   * @param deadline
   * @returns transaction data
   */
  async sendPermit(
    contractAddress: string,
    spender: string,
    value: number,
    deadline: number,
    abi = CustomERC20.abi
  ) {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        // this.wallet.connect(this.provider)
        this.provider
      );

      console.log(await contract.getVersion());

      const approve = {
        owner: this.wallet!.address,
        spender,
        value,
      };

      const nonce = parseInt(
        (await contract.getNonces(approve.owner)).toString()
      );

      const digest = getPermitDigest(
        await contract.name(),
        contract.address,
        config[`CHAIN_ID_${this.env}`],
        {
          approve,
          nonce,
          deadline,
        },
        "token"
      );

      const { v, r, s } = sign(
        digest,
        Buffer.from(this.wallet!.privateKey.substring(2), "hex")
      );

      const tx = await contract.populateTransaction.requestPermit(
        approve.owner,
        approve.spender,
        approve.value,
        deadline,
        v,
        r,
        s
      );

      let { status, data } = await axios.post(
        // `${config[`ENDPOINT_${this.env}`]}/sendToken`,
        `${config[`ENDPOINT_${this.env}`]}/sendPermit`,
        { tx, contractAddress, address: this.wallet?.address },
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      return data;
    } catch (error) {
      logger.info("[Send Permit] ", error);
    }
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
      `${config[`ENDPOINT_${this.env}`]}/mintToken`,
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
  async mintNFT(
    amount: number,
    uri: string,
    contractAddress = config[`PABLOCK_NFT_ADDRESS_${this.env}`],
    webhookUrl: string | null
  ) {
    let { status, data } = await axios.post(
      `${config[`ENDPOINT_${this.env}`]}/mintNFT`,
      { to: this.wallet!.address, amount, uri, contractAddress, webhookUrl },
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    logger.info(status, data);

    return data;
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
  async sendNFT(
    to: string,
    tokenId: number,
    deadline: number,
    contractAddress = config[`PABLOCK_NFT_ADDRESS_${this.env}`]
  ) {
    try {
      const customERC721 = new ethers.Contract(
        contractAddress,
        PablockNFT.abi,
        // this.wallet.connect(this.provider)
        this.provider
      );

      const approve = {
        owner: this.wallet!.address,
        spender: config[`PABLOCK_ADDRESS_${this.env}`],
        tokenId,
      };

      const nonce = parseInt(
        (await customERC721.getNonces(approve.owner)).toString()
      );

      const digest = getPermitDigest(
        await customERC721.name(),
        customERC721.address,
        config[`CHAIN_ID_${this.env}`],
        {
          approve,
          nonce,
          deadline,
        },
        "nft"
      );

      const { v, r, s } = sign(
        digest,
        Buffer.from(this.wallet!.privateKey.substring(2), "hex")
      );

      const tx = await customERC721.populateTransaction.requestPermit(
        approve.owner,
        approve.spender,
        approve.tokenId,
        deadline,
        v,
        r,
        s
      );

      let { status, data } = await axios.post(
        `${config[`ENDPOINT_${this.env}`]}/transferNFT`,
        { tx, to, tokenId, contractAddress },
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
      return data;
    } catch (err) {
      logger.error(`NFTTransfer error: ${err} `);
      return null;
    }
  }

  async executeNotarization(
    hash: string,
    uri: string,
    deadline = 1657121546000,
    metadata: object | null,
    webhookUrl: string | null,
    secret: string | null
  ) {
    try {
      const pablockNotarization = new ethers.Contract(
        config[`PABLOCK_NOTARIZATION_ADDRESS_${this.env}`],
        PablockNotarization.abi,
        // this.wallet.connect(this.provider)
        this.provider
      );

      const permit = await this.sendPermit(
        config[`PABLOCK_TOKEN_ADDRESS_${this.env}`],
        config[`PABLOCK_ADDRESS_${this.env}`],
        1,
        deadline,
        PablockToken.abi
      );

      const digest = getPermitDigest(
        "notarization",
        pablockNotarization.address,
        config[`CHAIN_ID_${this.env}`],
        { hash, uri, applicant: this.wallet!.address },
        "notarization"
      );

      console.log("DIGEST ==>", digest);

      const { v, r, s } = sign(
        digest,
        Buffer.from(this.wallet!.privateKey.substring(2), "hex")
      );

      const tx = await pablockNotarization.populateTransaction.notarize(
        hash,
        uri,
        this.wallet!.address,
        v,
        r,
        s
      );

      let { status, data } = await axios.post(
        `${config[`ENDPOINT_${this.env}`]}/sendTransaction`,
        { tx, from: this.wallet!.address },
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );
      return data;
    } catch (err) {
      logger.error(`Notarization error: ${err} `);
      return null;
    }
  }

  async prepareTransaction(
    contractObj: ContractStruct,
    functionName: string,
    params = []
  ) {
    let contract = new ethers.Contract(
      contractObj.address,
      contractObj.abi,
      this.wallet
    );

    let functionSignature = web3Abi.encodeFunctionCall(
      contractObj.abi.find(
        (el) => el.type === "function" && el.name === functionName
      ),
      params
    );

    const { data } = await axios.get(
      `${config[`ENDPOINT_${this.env}`]}/getNonce/${this.wallet!.address}`,
      {
        headers: { Authorization: `Bearer ${this.authToken}` },
      }
    );

    let { r, s, v } = await getTransactionData(
      data.nonce,
      functionSignature,
      this.wallet!.address,
      this.wallet!.privateKey,
      {
        name: contractObj.name,
        version: contractObj.version,
        address: contractObj.address,
      }
    );

    return {
      contractAddress: contractObj.address,
      userAddress: this.wallet!.address,
      functionSignature,
      r: `0x${r.toString("hex")}`,
      s: `0x${s.toString("hex")}`,
      v,
    };
  }

  async executeTransaction(tx: any) {
    const res = await axios.post(
      `${config[`ENDPOINT_${this.env}`]}/sendRawTransaction`,
      {
        tx,
      },
      { headers: { Authorization: `Bearer ${this.authToken}` } }
    );
    console.log("RESULT ==>", res);

    return res;
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
      let { status, data } = await axios.get(
        `${config[`ENDPOINT_${this.env}`]}/checkJWT`,
        {
          headers: {
            Authorization: `Bearer ${this.authToken}`,
          },
        }
      );

      logger.info(status, data);

      return data;
    } catch (error) {
      throw ERROR_TYPE.UNABLE_TO_CHECK_TOKEN;
    }
  }

  async generateSubJWT(address: string) {
    try {
      let { status, data } = await axios.get(
        `${config[`ENDPOINT_${this.env}`]}/generateSubJWT/${address}`,
        {
          headers: {
            // Authorization: `Bearer ${this.authToken}`,
            Authorization:
              "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiJhcGlfdGVzdCIsImFkZHJlc3MiOiJ1bmRlZmluZWQiLCJzdWJUb2tlbiI6dHJ1ZSwiaWF0IjoxNjMzNjg0NTk4fQ.UQEZ-IHNXNKwYO6Q7xRs_MrUGA37T-fG4QD3nTQwPJuA5emPNuE52X-RVJdSOcRiQWnTrgqm9q2EDZoM4ukuoQ",
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
