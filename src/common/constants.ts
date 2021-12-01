import config from "../config";
import PablockNFT from "./abis/PablockNFT";

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
