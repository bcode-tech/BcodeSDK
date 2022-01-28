const { PablockSDK } = require("../build");

const { ethers } = require("ethers");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

const pirvateKeys = require("../privateKeys.json");

const sdk = new PablockSDK({
  apiKey: "rart-api",
  privateKey:
    "0x0127cd18debc7d65205fbd28100af14d402f29171837c809c0cedb94a43468bc",
  config: { env: "MUMBAI", debugMode: true, endpoint: "http://127.0.0.1:8082" },
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

  // const res = await sdk.prepareTransaction(
  //   {
  //     address: "0x4E6cebEFa75E1D216C69907f9e5553f92f9b3492",
  //     abi: [
  //       {
  //         inputs: [
  //           {
  //             internalType: "string",
  //             name: "_uri",
  //             type: "string",
  //           },
  //         ],
  //         name: "mintToken",
  //         outputs: [],
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
  //     ],
  //     name: "ReasonedArtArtist",
  //     version: "0.0.1",
  //   },
  //   "mintToken",
  //   ["ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/100"]
  // );

  const res = await sdk.prepareTransaction(
    {
      address: config[`TEST_META_TX_MUMBAI`],
      abi: [
        {
          inputs: [],
          name: "increment",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      name: "TestMetaTransaction",
      version: "0.0.1",
    },
    "increment",
    []
  );

  console.log(res);

  // const data = await sdk.executeTransaction(res);

  await sdk.executeAsyncTransaction(res, {
    webhookUrl:
      "https://226a-2001-b07-6464-bdd1-fbce-1500-f5e2-56b5.ngrok.io/webhook",
    secret: "banana2",
    metadata: { test: "prova" },
  });
  await sdk.executeAsyncTransaction(res, {
    webhookUrl:
      "https://226a-2001-b07-6464-bdd1-fbce-1500-f5e2-56b5.ngrok.io/webhook",
    secret: "banana",
    metadata: { test: "prova" },
  });

  // console.log(data);

  // console.log(data);

  // console.log((await contract.getCounter()).toString());
})();
