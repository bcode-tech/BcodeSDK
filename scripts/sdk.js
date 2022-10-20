const { PablockSDK, Hash, QRCode } = require("../build");
const EthCrypto = require("eth-crypto");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

const pirvateKeys = require("../privateKeys.json");

const sdk = new PablockSDK({
  apiKey: "pablock-sdk",
  config: {
    env: "MUMBAI",
    debugMode: true,
    // rpcProvider:
    //   "https://polygon-mumbai.g.alchemy.com/v2/erULaYO44vemYJ5PyiWPGSpt_cbDQMbi",
  },
  privateKey:
    "0xfd110207f5ef09094f664ef4cdde102f0e36ffe9482a2ed2abf8731112396a02",
});

(async () => {
  await sdk.init();

  console.log(sdk.getWalletAddress());

  // console.log(sdk.getPablockContracts());

  console.log("PTK QUANTITY ==>", await sdk.getPablockTokenBalance());
  // console.log("TOKEN QUANTITY ==>", await sdk.getTokenBalance());

  // let res = await sdk.prepareTransaction(
  //   {
  //     // address: "0xE518725c53B4272d72c10b623A8443B62D19Ef1E",
  //     address: "0xa347328B5b71eCFFcA8Da951AE2bDDa42F32066D",
  //     abi: [
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
  //       {
  //         inputs: [
  //           {
  //             internalType: "uint256",
  //             name: "_counter",
  //             type: "uint256",
  //           },
  //         ],
  //         name: "setCounter",
  //         outputs: [],
  //         stateMutability: "nonpayable",
  //         type: "function",
  //       },
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
  //     name: "PablockNotarization",
  //     version: "0.1.1",
  //   },
  //   "notarize",
  //   [
  //     "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2",
  //     "",
  //     sdk.getWalletAddress(),
  //     "",
  //   ]
  // );

  // const signature =
  //   "b6c9ad8640628e618158968309ccd7c42ed34d82eada9346b1a33b9713f3e66453811ee580616cb6655f091be61cd08885e7003720852ccb53009eabadb99f8a1b";
  // const r = `0x${signature.substring(0, 64)}`;
  // const s = `0x${signature.substring(64, 128)}`;
  // const v = parseInt(signature.substring(128, 130)) + 27;

  // const requestId = await sdk.executeAsyncTransaction(res);
  // console.log(requestId);

  // console.log(
  //   await sdk.getMetaTxStatus("6ed207e1-8cb5-4a7e-bce7-a0048744f8e0")
  // );

  // console.log(await sdk.checkStatus("7bf5b3de-ba4d-48b4-a386-97e4a482130a"));

  for (let i = 0; i < 1; i++) {
    console.log(
      await sdk.notarizeHash(
        "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
      )
    );
  }

  // console.log(data);

  // console.log(metaTx);

  // const { status, requestId } = await sdk.executeAsyncTransaction(metaTx, {
  //   webhook:
  //     "https://europe-west3-tonale-wallet-dev.cloudfunctions.net/api/whitelistHook",
  // });
})();
