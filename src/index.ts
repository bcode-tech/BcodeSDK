//Libraries
import axios from "axios";
import { ethers, Wallet } from "ethers";

//Utils
import { sign, getPermitDigest } from "./common/utils";

//Constants
import { ERROR_TYPE } from "./common/constants";

//Abis
import CustomERC20 from "./common/abis/CustomERC20";
import PablockToken from "./common/abis/PablockToken";

//Config
import config from "../config";

// const config = process.env || [];

type Configuration = {
  env?: "LOCAL" | "MUMBAI" | "POLYGON";
  debugMode: boolean | false;
  // network: "LOCAL" | "MUMBAI" | "POLYGON";
};

type SdkOptions = {
  apiKey: string;
  privateKey: string;
  config?: Configuration;
};

export class PablockSDK {
  apiKey: string;
  wallet?: Wallet;
  provider?: any;
  authToken?: string;
  env: string;
  // network: string;

  constructor(sdkOptions: SdkOptions) {
    this.env = sdkOptions.config?.env || "MUMBAI";

    console.log(`[Debug] Working environment: ${this.env}`);

    if (sdkOptions.apiKey) {
      this.apiKey = sdkOptions.apiKey;
    } else {
      console.error("[Error] API key is required, please insert one!");
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

    if (!sdkOptions.config?.debugMode) {
      console.log = () => {};
    }
  }

  async init() {
    try {
      let { status, data } = await axios.get(
        `${config[`ENDPOINT_${this.env}`]}/generateJWT/${this.apiKey}`
      );

      if (status === 200) {
        this.authToken = data.authToken;
      } else {
        throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
      }
    } catch (error) {
      throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
    }
  }

  getAuthToken() {
    console.log("AUTH TOKEN ==>", this.authToken);
    return this.authToken;
  }

  getApiKey() {
    console.log("API KEY ==>", this.apiKey);
    return this.apiKey;
  }

  async getPablockTokenBalance(address: string = this.wallet!.address) {
    const pablockToken = new ethers.Contract(
      config[`PABLOCK_TOKEN_ADDRESS_${this.env}`],
      PablockToken.abi,
      this.provider
    );
    const balance = (await pablockToken.balanceOf(address)).toString();
    return balance;
  }

  async sendToken(
    contractAddress: string,
    spender: string,
    value: number,
    deadline: number
  ) {
    const customERC20 = new ethers.Contract(
      contractAddress,
      CustomERC20.abi,
      // this.wallet.connect(this.provider)
      this.provider
    );

    const approve = {
      owner: this.wallet!.address,
      spender,
      value,
    };

    const nonce = parseInt(
      (await customERC20.nonces(approve.owner)).toString()
    );

    const digest = getPermitDigest(
      await customERC20.name(),
      customERC20.address,
      parseInt(await customERC20.getChainId()),
      approve,
      nonce,
      deadline
    );

    const { v, r, s } = sign(
      digest,
      Buffer.from(this.wallet!.privateKey.substring(2), "hex")
    );

    const tx = await customERC20.populateTransaction.permit(
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
      "http://127.0.0.1:8082/sendPermit",
      { tx, contractAddress, address: this.wallet?.address },
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    return data;
  }

  async requestToken(to: string, amount: number, contractAddress: string) {
    let { status, data } = await axios.post(
      `${config[`ENDPOINT_${this.env}`]}/mintToken`,
      { contractAddress, to, amount },
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    return data;
  }

  async mintNFT(
    amount: number,
    uri: string,
    contractAddress: string,
    webhookUrl: string | null
  ) {
    let { status, data } = await axios.post(
      `${config[`ENDPOINT_${this.env}`]}/mintToken`,
      { to: this.wallet!.address, amount, uri, contractAddress, webhookUrl },
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    console.log(status, data);

    return data;
  }
}
