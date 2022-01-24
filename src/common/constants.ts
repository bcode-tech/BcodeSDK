import config from "../config";
import PablockNFT from "./abis/PablockNFT";
import PablockNotarization from "./abis/PablockNotarization";

export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs";

export const ERROR_TYPE = {
  NOT_INITIALIZE: "SDK not initialized",
  API_KEY_NOT_AUTHENTICATED: "API Key not authenticated",
  CONTRACT_ERROR: "Smart contract error",
  UNABLE_TO_GENERATE_SUB_JWT: "Unable to generate subJWT",
  UNABLE_TO_CHECK_TOKEN: "Unable to check token",
};

export const PABLOCK_NFT_OBJ = {
  abi: PablockNFT.abi,
  name: "PablockNFT",
  version: "0.2.1",
};

export const PABLOCK_NOTARIZATION_OBJ = {
  abi: PablockNotarization.abi,
  name: "PablockNotarization",
  version: "0.1.1",
};
