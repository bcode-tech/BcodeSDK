import config from "../config";
import BcodeNFT from "./abis/BcodeNFT";
import BcodeNotarization from "./abis/BcodeNotarization";

export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs";

export const ERROR_TYPE = {
  NOT_INITIALIZE: "SDK not initialized",
  API_KEY_NOT_AUTHENTICATED: "API Key not authenticated",
  CONTRACT_ERROR: "Smart contract error",
  UNABLE_TO_GENERATE_SUB_JWT: "Unable to generate subJWT",
  UNABLE_TO_CHECK_TOKEN: "Unable to check token",
};

export const BCODE_NFT_OBJ = {
  abi: BcodeNFT.abi,
  name: "PablockNFT",
  version: "0.2.2",
};

export const BCODE_NOTARIZATION_OBJ = {
  abi: BcodeNotarization.abi,
  name: "PablockNotarization",
  version: "0.1.1",
};
