const { PablockSDK } = require("../build");

const { ethers } = require("ethers");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

// NodeMonkey();

const sdk = new PablockSDK({
  apiKey: "api-test",
  privateKey:
    "0xf6a01b0dea644d7a82fc4ee90e4f5259a7bb67a62befe2d22cad609d5bfc5588",
  config: { env: "LOCAL", debugMode: true },
});

(async () => {
  await sdk.init();

  console.log(sdk.getWalletAddress());
  // await sdk.generateSubJWT();
  // console.log(
  //   await sdk.requestToken(10, "0xde4c74E7494808FDDDC396d68c8202Fcd0a1a3eF")
  // );

  // console.log("PTK QUANTITY ==>", await sdk.getPablockTokenBalance());
  // console.log("TOKEN QUANTITY ==>", await sdk.getTokenBalance());

  const res = await sdk.prepareTransaction(
    {
      address: config[`TEST_META_TX_LOCAL`],
      abi: testMetaTxAbi,
      name: "TestMetaTransaction",
      version: "0.0.1",
    },
    "increment",
    []
  );

  console.log(res);

  const data = await sdk.executeAsyncTransaction(res, {
    webhookUrl: "https://prova.it/hook",
    secret: "banana",
    metadata: {},
  });

  console.log(data);

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "https://polygon-mumbai.infura.io/v3/98084ec8ac4d49e181f0ffc83562f6f6"
  // );

  // const wallet = new ethers.Wallet(
  //   "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1"
  // ).connect(provider);
  // const contract = new ethers.Contract(
  //   "0x50D3A7B998C90EF96e0021e90027d093A529c67D",
  //   testMetaTxAbi,
  //   wallet
  // );

  // console.log((await contract.getCounter()).toString());
})();
