const { PablockSDK } = require("../build");

const { ethers } = require("ethers");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

// NodeMonkey();

const sdk = new PablockSDK({
  apiKey: "api_test",
  privateKey:
    "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1",
  config: { env: "MUMBAI", debugMode: true },
});

(async () => {
  await sdk.init();
  // await sdk.generateSubJWT();
  // console.log(
  //   await sdk.requestToken(10, "0xde4c74E7494808FDDDC396d68c8202Fcd0a1a3eF")
  // );

  // console.log("PTK QUANTITY ==>", await sdk.getPablockTokenBalance());
  // console.log("TOKEN QUANTITY ==>", await sdk.getTokenBalance());

  const res = await sdk.prepareTransaction(
    {
      address: "0x50D3A7B998C90EF96e0021e90027d093A529c67D",
      abi: testMetaTxAbi,
      name: "TestMetaTransaction",
      version: "0.0.1",
    },
    "increment",
    []
  );
  console.log(res);
  console.log(await sdk.executeTransaction(res));
})();
