const axios = require("axios");
const { BigNumber } = require("ethers");
const { lt } = require("lodash");
const fs = require("fs");
const { BcodeSDK, Hash } = require("../build");

const config = require("../config.json");
const privateKeys = require("../privateKeys.json");

let tokenId = null;
let txData = null;

let notarizationRequestId = null;

const {
  abi: testMetaTxAbi,
} = require("../src/common/abis/TestMetaTransaction");

const configParams = {
  env: "MUMBAI",
  debugMode: false,
  // endpoint: "http://127.0.0.1:8083",
};
const apiKey = "pablock-sdk";
const TEST_META_TX = "0x794E318E01d21e8462B1Bf5Ce729B6759Ef06dEe";

const TEST_WALLET = {
  privateKey:
    "0x60dcbce325a230b77e46b2f697eafb29a5bdf8d2a7eb6b7763d72224e3a624cf",
  mnemonic:
    "news transfer speed release slide advance sheriff follow whisper parade view novel",
  address: "0x67C4C56f9A0FF8cD6d5a798D9Ee07DBa7e0f69cF",
};

const sdk = new BcodeSDK({
  apiKey: apiKey,
  privateKey: privateKeys[0],
  config: configParams,
});

const sdk2 = new BcodeSDK({
  apiKey: apiKey,
  privateKey: privateKeys[1],
  config: configParams,
});

describe("Bcode SDK Test", () => {
  it("should create Library", async () => {
    await sdk.init();
    await sdk2.init();
    expect(sdk.getApiKey()).toBe(apiKey);
  });
  it("should be authenticated", async () => {
    expect(await sdk.checkJWTValidity()).toBe(true);
  });
  it("should have PTK", async () => {
    let balance = BigNumber.from(await sdk.getBcodeTokenBalance());
    if (balance.lt(10)) {
      await sdk.requestTestPTK();
    }

    balance = await sdk.getBcodeTokenBalance();
    expect(balance).toBeGreaterThan(0);
  });
  // it("should not have MATIC", async () => {
  //   const matic = await sdk.getMaticBalance();
  //   expect(matic).toEqual(0);
  // });
  it("should return contracts addresses", async () => {
    expect(sdk.getBcodeContracts()).toMatchObject({
      // PABLOCK_TOKEN_ADDRESS: "0x4327D230F44594DFD539bA302682EA243D670C8e",
      // PABLOCK_META_TRANSACTION: "0xAdEB4cEA8E4A28E2C6f83d1820DAB686929Fbf9A",
      // PABLOCK_NOTARIZATION: "0x163eCd4AF0D45e24dEc4F7aCacC904e2bcfe248B",
      // PABLOCK_NFT: "0x15c6a254dB37BFd9D6031F940B3249CFA9D993b5",
      // PABLOCK_MULTISIGN_FACTORY: "0x693F75afc8540b91a8741728eC36027cd07779b8",
      PABLOCK_META_TRANSACTION: "0x4419AF074BC3a6C7D90f242dfdC1a163Bc710091",
      PABLOCK_MULTISIGN_FACTORY: "0x7296EE0F1036eC74eCF111E676e70eE97597A7d1",
      PABLOCK_NFT: "0x314Caa948A6BD160451e823510C467A8A330C074",
      PABLOCK_NOTARIZATION: "0x8344F05f33AE80f1c03C8dc8f619719AcDe8cE49",
      PABLOCK_TOKEN_ADDRESS: "0x4453cfB250e3a81197D331C86A9B1C8778bb0246",
    });
  });
});

// describe("Execute meta transaction", () => {
//   it("should prepare transaction", async () => {
//     txData = await sdk.prepareTransaction(
//       {
//         address: TEST_META_TX,
//         abi: testMetaTxAbi,
//         name: "TestMetaTransaction",
//         version: "0.1.0",
//       },
//       "decrement",
//       []
//     );

//     expect(txData).toMatchObject({
//       contractAddress: expect.any(String),
//       userAddress: expect.any(String),
//       functionSignature: expect.any(String),
//       r: expect.any(String),
//       s: expect.any(String),
//       v: expect.any(Number),
//     });
//   });
//   // it("should send meta transaction", async () => {
//   //   jest.setTimeout(25000);
//   //   let res = await sdk.executeAsyncTransaction(txData);
//   //   console.log("RES ==>", res);
//   //   expect(res).toMatchObject({
//   //     from: expect.any(String),
//   //     to: expect.any(String),
//   //     transactionHash: expect.any(String),
//   //     blockHash: expect.any(String),
//   //   });
//   // });
//   it("should request metatx async execution", async () => {
//     jest.setTimeout(15000);
//     let data = await sdk.executeAsyncTransaction(
//       await sdk.prepareTransaction(
//         {
//           address: TEST_META_TX,
//           abi: testMetaTxAbi,
//           name: "TestMetaTransaction",
//           version: "0.1.0",
//         },
//         "decrement",
//         []
//       )
//     );

//     expect({ data }).toMatchObject({ data: expect.any(String) });
//   });
// });

describe("Bcode SDK NFT Test", () => {
  it("should mint BcodeNFT", async () => {
    jest.setTimeout(15000);

    let data = await sdk.executeAsyncTransaction(
      await sdk.prepareTransaction(
        {
          address: sdk.getBcodeContracts().PABLOCK_NFT,
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "_uri",
                  type: "string",
                },
              ],
              name: "mintToken",
              outputs: [
                {
                  internalType: "uint256[]",
                  name: "indexes",
                  type: "uint256[]",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          name: "PablockNFT",
          version: "0.2.2",
        },
        "mintToken",
        [
          sdk.getWalletAddress(),
          "https://gateway.pinata.cloud/ipfs/QmcKwHTo6Mc7LaQFR1eGP3u8Qp863MwjfENS2XNQzP14ST",
        ]
      )
    );
    // expect(tx).toMatchObject({
    //   from: expect.any(String),
    //   to: expect.any(String),
    //   transactionHash: expect.any(String),
    //   blockHash: expect.any(String),
    // });
    expect({ data }).toMatchObject({ data: expect.any(String) });
  });
  // it("should have BcodeNFTs", async () => {
  //   jest.setTimeout(15000);
  //   const contractAddress = sdk.getBcodeContracts().PABLOCK_NFT;

  //   const tokens = await sdk.getOwnedNFT([contractAddress]);

  //   expect(tokens[contractAddress].length).toBeGreaterThan(0);
  //   tokenId = tokens[contractAddress][0].tokenId;
  // });
  // it("should send BcodeNFT", async () => {
  //   jest.setTimeout(15000);
  //   const data = await sdk.sendBcodeNFT(sdk2.getWalletAddress(), tokenId);

  //   expect({ data }).toMatchObject({ data: expect.any(String) });
  // });
  // it("receiver address should have NFT", async () => {
  //   const contractAddress = sdk.getBcodeContracts().PABLOCK_NFT;

  //   const tokens = await sdk2.getOwnedNFT([contractAddress]);
  //   // console.log("HIS TOKENS ==>", tokens);

  //   expect(!!tokens[contractAddress].find((el) => el.tokenId === tokenId)).toBe(
  //     true
  //   );
  // });
});

describe("Bcode SDK Notarization Test", () => {
  it("should notarize hash (bundle)", async () => {
    jest.setTimeout(15000);
    notarizationRequestId = await sdk.notarizeHash(
      "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
    );

    expect(typeof notarizationRequestId).toBe("string");
  });
  it("should check status", async () => {
    jest.setTimeout(15000);
    const { receipt } = await sdk.checkStatus(notarizationRequestId);

    expect(receipt).toBe(null);
  });
});

describe("Bcode Hash module", () => {
  it("String hash", () => {
    expect(Hash.fromString("ciao")).toBe(
      "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
    );
  });
  it("Buffer hash", () => {
    const file = fs.readFileSync("./README.md");
    expect(Hash.fromBuffer(file.buffer)).toBe(
      "0x17e578d1cc60cf707c2851113bdb3b39da73cea119c2517deaff9dad95fc6d40"
    );
  });
});

describe("Bcode Wallet", () => {
  it("Reset wallet", () => {
    sdk.resetWallet();
    expect(sdk.getWallet()).toBe(null);
  });
  it("Import from privateKey", () => {
    sdk.setPrivateKey(TEST_WALLET.privateKey);
    expect(sdk.getWalletAddress()).toBe(TEST_WALLET.address);
    sdk.resetWallet();
    expect(sdk.getWallet()).toBe(null);
  });
  it("Import from mnemonic", () => {
    sdk.setMnemonicPhrase(TEST_WALLET.mnemonic);
    expect(sdk.getWalletAddress()).toBe(TEST_WALLET.address);
    sdk.resetWallet();
    expect(sdk.getWallet()).toBe(null);
  });
});
