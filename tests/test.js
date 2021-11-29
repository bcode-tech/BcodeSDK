// const NodeMonkey = require("node-monkey");

const { ethers } = require("ethers");
const { PablockSDK } = require("../build");

const config = require("../config.json");

let tokenId = null;

const { testMetaTxAbi } = require("../scripts/abi");

const env = "LOCAL";

const sdk = new PablockSDK({
  apiKey: "api-test",
  privateKey:
    "0xf6a01b0dea644d7a82fc4ee90e4f5259a7bb67a62befe2d22cad609d5bfc5588",
  config: { env, debugMode: true },
});

// const sdk2 = new PablockSDK({
//   apiKey: "api-test",
//   privateKey:
//     "0xb4f68ff7c166097d16fc64fc1ece2d5be82e3fac3a7bb2a8efa012d4a88d726d",
//   config: { env: "LOCAL", debugMode: true },
// });

(async () => {
  await sdk.init();
  // await sdk2.init();

  // await sdk.sendPermit("0x31726b5C129E23E2B045dc5BCB661c770B11DC91");

  // const { tx } = await sdk.mintNFT(1, "http://uridiprova.it");
  // console.log(tx);

  // const tokens = await sdk.getOwnedNFT([
  //   "0xFe4074912571C54E1402992d1CdA77A22098cD4f",
  // ]);
  // console.log(tokens);

  // const tokens = await sdk.getOwnedNFT([
  //   "0x12eA8a8C7C8b427246D84911454F3eC86440da17",
  // ]);
  // console.log(tokens);

  // const res = await sdk.sendNFT(
  //   "0x4c617b110afc0926bf35dce33D0e0178580B50AF",
  //   0,
  //   1657121546000
  // );
  // console.log(res);
})();

describe("Pablock SDK Test", () => {
  it("should create Library", () => {
    expect(sdk.getApiKey()).toBe("api-test");
  });

  it("should have PTK", async () => {
    expect(await sdk.getPablockTokenBalance()).toBeGreaterThan(0);
  });
  it("should not have MATIC", async () => {
    expect(await sdk.getMaticBalance()).toEqual(0);
  });
});

describe("Execute meta transaction", () => {
  it("should prepare transaction", async () => {
    const txData = await sdk.prepareTransaction(
      {
        address: config[`TEST_META_TX_${env}`],
        abi: testMetaTxAbi,
        name: "TestMetaTransaction",
        version: "0.0.1",
      },
      "setCounter",
      [2, sdk.getWalletAddress()]
    );

    expect(txData).toMatchObject({
      contractAddress: expect.any(String),
      userAddress: expect.any(String),
      functionSignature: expect.any(String),
      r: expect.any(String),
      s: expect.any(String),
      v: expect.any(Number),
    });
  });
});

describe("Pablock SDK NFT Test", () => {
  it("should mint and transfer NFT", async () => {
    const { tx } = await sdk.mintNFT(1, "http://uridiprova.it");

    expect(tx).toMatchObject({
      from: expect.any(String),
      to: expect.any(String),
      transactionHash: expect.any(String),
      blockHash: expect.any(String),
    });
  });

  it("should have NFTs", async () => {
    const contractAddress = config[`PABLOCK_NFT_${env}`];
    console.log(`PABLOCK_NFT_${this.env}`);
    const tokens = await sdk.getOwnedNFT([contractAddress]);
    console.log("MY TOKENS ==>", tokens);

    expect(tokens[contractAddress].length).toBeGreaterThan(0);
    tokenId = tokens[contractAddress][0].tokenId;
  });

  // it("should send NFT", async () => {
  //   const res = await sdk.sendNFT(
  //     "0x4c617b110afc0926bf35dce33D0e0178580B50AF",
  //     tokenId,
  //     1657121546000
  //   );

  //   expect(res.tx).toMatchObject({
  //     from: expect.any(String),
  //     to: expect.any(String),
  //     transactionHash: expect.any(String),
  //     blockHash: expect.any(String),
  //   });
  // });

  // it("receiver address should have NFT", async () => {
  //   const contractAddress = config[`PABLOCK_NFT_ADDRESS_LOCAL`];

  //   const tokens = await sdk2.getOwnedNFT([contractAddress]);
  //   // console.log("HIS TOKENS ==>", tokens);

  //   expect(!!tokens[contractAddress].find((el) => el.tokenId === tokenId)).toBe(
  //     true
  //   );
  // });
});

// describe("Pablock SDK Notarization Test", () => {
//   it("Send permit and", async () => {
//     expect(true).toBe(true);
//   });
// });
