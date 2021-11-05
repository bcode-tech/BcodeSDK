const { PablockSDK } = require("../build");

const { ethers } = require("ethers");

const config = require("../config.json");
const { abi } = require("./abi");

// NodeMonkey();

// const sdk = new PablockSDK({
//   apiKey: "api_test",
//   privateKey:
//     "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1",
//   config: { env: "LOCAL", debugMode: true },
// });

(async () => {
  let provider = new ethers.providers.JsonRpcProvider(
    config.RPC_PROVIDER_LOCAL
  );
  let contract = new ethers.Contract(
    "0x2f5C8a986f4b1136b50b0F0D7F3fe2cD5046a6c3",
    abi,
    provider
  );

  console.log(contract.interface.getFunction("getNonces(address)"));

  // await sdk.init();
  // await sdk.generateSubJWT();
  // console.log(
  //   await sdk.requestToken(10, "0xde4c74E7494808FDDDC396d68c8202Fcd0a1a3eF")
  // );
  // console.log("PTK QUANTITY ==>", typeof (await sdk.getPablockTokenBalance()));
  // console.log("TOKEN QUANTITY ==>", await sdk.getTokenBalance());
  // const { tx } = await sdk.mintNFT(1, "http://uridiprova.it");
  // console.log(tx);
})();
