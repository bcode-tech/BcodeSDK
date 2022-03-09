const { PablockSDK, Hash, QRCode } = require("../build");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

const pirvateKeys = require("../privateKeys.json");

const sdk = new PablockSDK({
  apiKey: "pablock-sdk",
  config: {
    env: "LOCAL",
    endpoint: "http://127.0.0.1:8083",
    debugMode: true,
  },
});

(async () => {
  await sdk.init();

  // console.log(sdk.getWalletAddress());

  // console.log(sdk.getPablockContracts());

  // console.log("PTK QUANTITY ==>", await sdk.getPablockTokenBalance());
  // console.log("TOKEN QUANTITY ==>", await sdk.getTokenBalance());

  // let res = await sdk.checkBundledNotarization(
  //   "09289d0d-4836-48d8-a7b2-fa9aa632faa9",
  //   ["merkleRoot", "inclusion"]
  // );

  // await sdk.requestTestPTK();

  const res = await sdk.prepareTransaction(
    {
      address: "0xE518725c53B4272d72c10b623A8443B62D19Ef1E",
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

  // const requestId = await sdk.executeAsyncTransaction(res);

  // console.log(requestId);

  console.log(
    await sdk.getMetaTxStatus("6ed207e1-8cb5-4a7e-bce7-a0048744f8e0")
  );

  // for (let i = 0; i < 400; i++) {
  //   console.log(
  //     await sdk.notarizeHash(
  //       "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
  //     )
  //   );
  // }

  // console.log(data);
})();
