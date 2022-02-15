const { PablockSDK, Hash, QRCode } = require("../build");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

const pirvateKeys = require("../privateKeys.json");

const sdk = new PablockSDK({
  apiKey: "pablock-sdk",
  config: {
    env: "LOCAL",
    debugMode: true,
    endpoint: "http://127.0.0.1:8082",
  },
});

(async () => {
  await sdk.init();

  // console.log(sdk.getWalletAddress());

  await sdk.getPablockTokenBalance();

  // console.log("PTK QUANTITY ==>", await sdk.getPablockTokenBalance());
  // console.log("TOKEN QUANTITY ==>", await sdk.getTokenBalance());

  // let res = await sdk.checkBundledNotarization(
  //   "09289d0d-4836-48d8-a7b2-fa9aa632faa9",
  //   ["merkleRoot", "inclusion"]
  // );

  // await sdk.requestTestPTK();

  const res = await sdk.prepareTransaction(
    {
      address: "0xbFa175f1930833dE77bcE8a185b48Cc60bDb81a4",
      abi: [
        {
          inputs: [],
          name: "decrement",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes32",
              name: "hash",
              type: "bytes32",
            },
            {
              internalType: "string",
              name: "uri",
              type: "string",
            },
            {
              internalType: "address",
              name: "applicant",
              type: "address",
            },
            {
              internalType: "string",
              name: "appId",
              type: "string",
            },
          ],
          name: "notarize",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      name: "TestMetaTransaction",
      version: "0.1.0",
    },
    "decrement",
    []
  );

  // for (let i = 0; i < 400; i++) {
  //   console.log(
  //     await sdk.notarizeHash(
  //       "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
  //     )
  //   );
  // }

  await sdk.executeAsyncTransaction(res, {
    webhookUrl: "http://127.0.0.1:8082/webhook",
    secret: "banana",
    metadata: { test: "prova" },
    verbose: true,
  });

  // console.log(data);
})();
