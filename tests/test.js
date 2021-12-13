const { PablockSDK } = require("../build");

const config = require("../config.json");
const privateKeys = require("../privateKeys.json");

let tokenId = null;
let txData = null;

const { testMetaTxAbi } = require("../scripts/abi");

const env = "MUMBAI";

const sdk = new PablockSDK({
  apiKey: "api-test",
  privateKey: privateKeys[0],
  config: { env, debugMode: true },
});

const sdk2 = new PablockSDK({
  apiKey: "api-test",
  privateKey: privateKeys[1],
  config: { env, debugMode: true },
});

describe("Pablock SDK Test", () => {
  it("should create Library", async () => {
    await sdk.init();
    await sdk2.init();
    expect(sdk.getApiKey()).toBe("api-test");
  });

  it("should be authenticated", async () => {
    expect(await sdk.checkJWTValidity()).toBe(true);
  });

  it("should have PTK", async () => {
    const balance = await sdk.getPablockTokenBalance();
    expect(balance).toBeGreaterThan(0);
  });
  it("should not have MATIC", async () => {
    const matic = await sdk.getMaticBalance();
    expect(matic).toEqual(0);
  });
});

describe("Execute meta transaction", () => {
  it("should prepare transaction", async () => {
    txData = await sdk.prepareTransaction(
      {
        address: config[`TEST_META_TX_${env}`],
        abi: testMetaTxAbi,
        name: "TestMetaTransaction",
        version: "0.0.1",
      },
      "increment",
      []
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
  it("should send meta transaction", async () => {
    jest.setTimeout(15000);
    let res = await sdk.executeTransaction(txData);

    expect(res).toMatchObject({
      from: expect.any(String),
      to: expect.any(String),
      transactionHash: expect.any(String),
      blockHash: expect.any(String),
    });
  });
});

describe("Pablock SDK NFT Test", () => {
  it("should mint PablockNFT", async () => {
    jest.setTimeout(15000);
    const tx = await sdk.mintPablockNFT(1, "http://uridiprova.it");

    expect(tx).toMatchObject({
      from: expect.any(String),
      to: expect.any(String),
      transactionHash: expect.any(String),
      blockHash: expect.any(String),
    });
  });

  it("should have PablockNFTs", async () => {
    jest.setTimeout(15000);
    const contractAddress = config[`PABLOCK_NFT_${env}`];

    const tokens = await sdk.getOwnedNFT([contractAddress]);

    expect(tokens[contractAddress].length).toBeGreaterThan(0);
    tokenId = tokens[contractAddress][0].tokenId;
  });

  it("should send PablockNFT", async () => {
    jest.setTimeout(15000);
    const res = await sdk.sendPablockNFT(sdk2.getWalletAddress(), tokenId);

    expect(res).toMatchObject({
      from: expect.any(String),
      to: expect.any(String),
      transactionHash: expect.any(String),
      blockHash: expect.any(String),
    });
  });

  it("receiver address should have NFT", async () => {
    const contractAddress = config[`PABLOCK_NFT_${env}`];

    const tokens = await sdk2.getOwnedNFT([contractAddress]);
    // console.log("HIS TOKENS ==>", tokens);

    expect(!!tokens[contractAddress].find((el) => el.tokenId === tokenId)).toBe(
      true
    );
  });
});

// describe("Pablock SDK Notarization Test", () => {
//   it("Send permit and", async () => {
//     expect(true).toBe(true);
//   });
// });
