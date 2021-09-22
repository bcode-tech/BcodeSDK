// const NodeMonkey = require("node-monkey");

const { ethers } = require("ethers");
const { PablockSDK } = require("../build");

const config = require("../config.json");

// NodeMonkey();

const sdk = new PablockSDK({
  apiKey: "api_test",
  privateKey:
    "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1",
  config: { env: "LOCAL", debugMode: true },
});

const sdk2 = new PablockSDK({
  apiKey: "api_test",
  privateKey:
    "0xcac55b77a9a055839272436dba5c38aa9ed18b052330c9a3bf426848ccfcd4fc",
  config: { env: "LOCAL", debugMode: true },
});

(async () => {
  await sdk.init();
  await sdk2.init();

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
    expect(sdk.getApiKey()).toBe("api_test");
  });

  it("should have token", async () => {
    expect(await sdk.getPablockTokenBalance()).toBeGreaterThan(0);
  });

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
    const contractAddress = config[`PABLOCK_NFT_ADDRESS_LOCAL`];

    const tokens = await sdk.getOwnedNFT([contractAddress]);
    // console.log(tokens);

    expect(tokens[contractAddress].length).toBeGreaterThan(0);
  });

  it("should send NFT", async () => {
    const res = await sdk.sendNFT(
      "0x4c617b110afc0926bf35dce33D0e0178580B50AF",
      1,
      1657121546000
    );

    console.log(res);

    expect(res.tx).toMatchObject({
      from: expect.any(String),
      to: expect.any(String),
      transactionHash: expect.any(String),
      blockHash: expect.any(String),
    });
  });

  it("receiver addres shoul have NFT", async () => {
    const contractAddress = config[`PABLOCK_NFT_ADDRESS_LOCAL`];

    const tokens = await sdk2.getOwnedNFT([contractAddress]);
    console.log(tokens);

    expect(tokens[contractAddress].length).toBeGreaterThan(0);
  });
});
