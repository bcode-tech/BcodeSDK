import axios from "axios";
import { ethers, Wallet } from "ethers";

import { abi } from "./common/abis/customERC20.js";

import { sign, getPermitDigest } from "./common/utils";

import { ERROR_TYPE } from "./common/constants";

import config from "../config.json";

type Configuration = {
  env?: "LOCAL" | "DEV" | "PROD";
  network: "MUMBAI" | "LOCAL";
};

type SdkOptions = {
  apiKey: string;
  privateKey: string;
  config?: Configuration;
};

export default class PablockSDK {
  apiKey: string;
  wallet?: Wallet;
  provider?: any;
  authToken?: string;
  env: string;
  network: string;

  constructor(sdkOptions: SdkOptions) {
    this.apiKey = sdkOptions.apiKey;

    this.env = sdkOptions.config?.env || "LOCAL";

    this.network = sdkOptions.config?.network || "MUMBAI";

    if (sdkOptions.privateKey) {
      this.wallet = new ethers.Wallet(sdkOptions.privateKey);

      this.provider = new ethers.providers.JsonRpcProvider(
        config[`RPC_PROVIDER_${this.network}`]
      );
    } else {
      this.wallet = ethers.Wallet.createRandom();
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
  }

  async sendToken(
    contractAddress: string,
    spender: string,
    value: number,
    deadline: number,
    config?: Object
  ) {
    const customERC20 = new ethers.Contract(
      contractAddress,
      abi,
      // this.wallet.connect(this.provider)
      this.provider
    );

    const approve = {
      owner: this.wallet.address,
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
      Buffer.from(this.wallet.privateKey.substring(2), "hex")
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
      { tx, contractAddress, address: this.wallet.address },
      {
        headers: {
          Authorization: `Bearer ${this.authToken}`,
        },
      }
    );

    return data;
  }

  async requestToken(contractAddress: string, to: string, amount: number) {
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
}
