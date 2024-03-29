import { StringNullableChain } from "lodash";

type Configuration = {
  env: "LOCAL" | "MUMBAI" | "POLYGON";
  debugMode: boolean | false;
  endpoint?: string;
  rpcProvider?: string;
  bcodeContracts?: BcodeContractsObj | {};
};

export type SdkOptions = {
  apiKey: string;
  authToken?: string;
  privateKey?: string;
  config: Configuration;
};

export type ContractStruct = {
  address: string;
  abi: Array<any>;
  name: string;
  version: string;
};

export type MetaTransaction = {
  contractAddress: string;
  userAddress: string;
  functionSignature: string;
  r: string;
  s: string;
  v: any;
};

export type Optionals = {
  webhookUrl: string | null;
  metadata: { [key: string]: any } | null;
  secret: string | null;
  verbose: boolean | null;
};

export type ReturnParam =
  | "leaves"
  | "merkleRoot"
  | "merkleProof"
  | "inclusion"
  | "hash";

type BcodeContracts =
  | "PABLOCK_TOKEN_ADDRESS"
  | "PABLOCK_META_TRANSACTION"
  | "PABLOCK_NOTARIZATION"
  | "PABLOCK_NFT"
  | "PABLOCK_MULTISIGN_FACTORY";

export type BcodeContractsObj = { [key in BcodeContracts]: string };
