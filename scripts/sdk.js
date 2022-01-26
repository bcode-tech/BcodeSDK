const { PablockSDK } = require("../build");

const { ethers } = require("ethers");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

const pirvateKeys = require("../privateKeys.json");

const sdk = new PablockSDK({
  apiKey: "api-test",
  privateKey:
    "0x0127cd18debc7d65205fbd28100af14d402f29171837c809c0cedb94a43468bc",
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

  // let res = await sdk.checkBundledNotarization(
  //   "09289d0d-4836-48d8-a7b2-fa9aa632faa9",
  //   ["merkleRoot", "inclusion"]
  // );

  // await sdk.requestTestPTK();

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

  // const data = await sdk.executeTransaction(res);

  const data = await sdk.executeAsyncTransaction(res, {
    webhookUrl: "https://prova.it/hook",
    secret: "banana",
    metadata: {},
  });

  console.log(data);

  // console.log(data);

  // console.log((await contract.getCounter()).toString());
})();
