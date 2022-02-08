const { PablockSDK, Hash } = require("../build");

const config = require("../config.json");
const { abi, testMetaTxAbi, metaTxAbi } = require("./abi");

const pirvateKeys = require("../privateKeys.json");

const sdk = new PablockSDK({
  apiKey: "pablock-sdk",
  privateKey:
    "0x2187109768f00bcf7d34a0c03879036d6e0410625762b85a124a382091498ebc",
  config: { env: "MUMBAI", debugMode: true },
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

  await sdk.requestTestPTK();

  // const res = await sdk.prepareTransaction(
  //   {
  //     address: config[`TEST_META_TX_LOCAL`],
  //     abi: testMetaTxAbi,
  //     name: "TestMetaTransaction",
  //     version: "0.0.1",
  //   },
  //   "increment",
  //   []
  // );

  // const res = await sdk.prepareTransaction(
  //   {
  //     // address: config[`TEST_META_TX_MUMBAI`],
  //     address: "0xa347328B5b71eCFFcA8Da951AE2bDDa42F32066D",
  //     abi: [
  //       {
  //         inputs: [],
  //         name: "increment",
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
  //     "PablockSDK",
  //   ]
  // );

  // console.log(res);

  // for (let i = 0; i < 8; i++) {
  //   console.log(
  //     await sdk.notarizeHash(
  //       "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
  //     )
  //   );
  // }

  // const data = await sdk.executeAsyncTransaction(res);
  // console.log(data);
  // await sdk.executeAsyncTransaction(res, {
  //   webhookUrl:
  //     "https://226a-2001-b07-6464-bdd1-fbce-1500-f5e2-56b5.ngrok.io/webhook",
  //   secret: "banana",
  //   metadata: {},
  // });

  // console.log(data);

  // console.log((await contract.getCounter()).toString());

  console.log(Hash.generateHash("ciao"));
})();
