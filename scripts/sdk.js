const { PablockSDK, Hash, QRCode } = require("../build");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

const pirvateKeys = require("../privateKeys.json");

const sdk = new PablockSDK({
  apiKey: "pablock-sdk",
  config: {
    env: "MUMBAI",
    debugMode: true,
    rpcProvider:
      "https://polygon-mumbai.g.alchemy.com/v2/erULaYO44vemYJ5PyiWPGSpt_cbDQMbi",
  },
  privateKey:
    "0xfd110207f5ef09094f664ef4cdde102f0e36ffe9482a2ed2abf8731112396a02",
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

  // const res = await sdk.prepareTransaction(
  //   {
  //     address: "0xE518725c53B4272d72c10b623A8443B62D19Ef1E",
  //     abi: [
  //       {
  //         inputs: [],
  //         name: "decrement",
  //         outputs: [],
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
  //       {
  //         inputs: [
  //           {
  //             internalType: "bytes32",
  //             name: "hash",
  //             type: "bytes32",
  //           },
  //           {
  //             internalType: "string",
  //             name: "uri",
  //             type: "string",
  //           },
  //           {
  //             internalType: "address",
  //             name: "applicant",
  //             type: "address",
  //           },
  //           {
  //             internalType: "string",
  //             name: "appId",
  //             type: "string",
  //           },
  //         ],
  //         name: "notarize",
  //         outputs: [],
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
  //     ],
  //     name: "TestMetaTransaction",
  //     version: "0.1.0",
  //   },
  //   "decrement",
  //   []
  // );

  // const requestId = await sdk.executeAsyncTransaction(res);

  // console.log(requestId);

  // console.log(
  //   await sdk.getMetaTxStatus("6ed207e1-8cb5-4a7e-bce7-a0048744f8e0")
  // );

  // console.log(await sdk.checkStatus("7bf5b3de-ba4d-48b4-a386-97e4a482130a"));

  // for (let i = 0; i < 1; i++) {
  //   console.log(
  //     await sdk.notarizeHash(
  //       "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
  //     )
  //   );
  // }

  // console.log(data);

  const metaTx = await sdk.prepareTransaction(
    {
      address: "0xF47F435B24e7197Df8F1E58722adA31A7f284Ad0",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_addr",
              type: "address",
            },
          ],
          name: "enableUser",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      name: "TonaleCertificates",
      version: "0.0.1",
    },
    "enableUser",
    ["0x35D9BA2a46534b76f39C983DFcf2f5B459491f5F"],
    { nonce: 0 }
  );

  console.log(metaTx);

  // const { status, requestId } = await sdk.executeAsyncTransaction(metaTx, {
  //   webhook:
  //     "https://europe-west3-tonale-wallet-dev.cloudfunctions.net/api/whitelistHook",
  // });
})();
