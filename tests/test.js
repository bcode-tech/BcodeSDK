const { default: axios } = require("axios");
const { BigNumber } = require("ethers");
const { lt } = require("lodash");
const fs = require("fs");
const { PablockSDK, Hash } = require("../build");

const config = require("../config.json");
const privateKeys = require("../privateKeys.json");

let tokenId = null;
let txData = null;

const { testMetaTxAbi } = require("../scripts/abi");

const env = "LOCAL";
const apiKey = "pablock-sdk";
const TEST_META_TX = "0x794E318E01d21e8462B1Bf5Ce729B6759Ef06dEe";

const sdk = new PablockSDK({
  apiKey: apiKey,
  privateKey: privateKeys[0],
  config: { env, debugMode: true, endpoint: "http://127.0.0.1:8083" },
});

const sdk2 = new PablockSDK({
  apiKey: apiKey,
  privateKey: privateKeys[1],
  config: { env, debugMode: true, endpoint: "http://127.0.0.1:8083" },
});

describe("Pablock SDK Test", () => {
  it("should create Library", async () => {
    await sdk.init();
    await sdk2.init();
    expect(sdk.getApiKey()).toBe(apiKey);
  });
  it("should be authenticated", async () => {
    expect(await sdk.checkJWTValidity()).toBe(true);
  });
  it("should have PTK", async () => {
    let balance = BigNumber.from(await sdk.getPablockTokenBalance());
    if (balance.lt(10)) {
      await sdk.requestTestPTK();
    }

    balance = await sdk.getPablockTokenBalance();
    expect(balance).toBeGreaterThan(0);
  });
  // it("should not have MATIC", async () => {
  //   const matic = await sdk.getMaticBalance();
  //   expect(matic).toEqual(0);
  // });
  it("should return contracts addresses", async () => {
    expect(sdk.getPablockContracts()).toMatchObject({
      PABLOCK_TOKEN_ADDRESS: "0x4327D230F44594DFD539bA302682EA243D670C8e",
      PABLOCK_META_TRANSACTION: "0xAdEB4cEA8E4A28E2C6f83d1820DAB686929Fbf9A",
      PABLOCK_NOTARIZATION: "0x163eCd4AF0D45e24dEc4F7aCacC904e2bcfe248B",
      PABLOCK_NFT: "0x15c6a254dB37BFd9D6031F940B3249CFA9D993b5",
      PABLOCK_MULTISIGN_FACTORY: "0x693F75afc8540b91a8741728eC36027cd07779b8",
    });
  });
});

describe("Execute meta transaction", () => {
  it("should prepare transaction", async () => {
    txData = await sdk.prepareTransaction(
      {
        address: TEST_META_TX,
        abi: testMetaTxAbi,
        name: "TestMetaTransaction",
        version: "0.1.0",
      },
      "decrement",
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
    jest.setTimeout(25000);
    let res = await sdk.executeTransaction(txData);

    expect(res).toMatchObject({
      from: expect.any(String),
      to: expect.any(String),
      transactionHash: expect.any(String),
      blockHash: expect.any(String),
    });
  });
  it("should request metatx async execution", async () => {
    jest.setTimeout(15000);
    let data = await sdk.executeAsyncTransaction(
      await sdk.prepareTransaction(
        {
          address: TEST_META_TX,
          abi: testMetaTxAbi,
          name: "TestMetaTransaction",
          version: "0.1.0",
        },
        "decrement",
        []
      )
    );

    expect({ data }).toMatchObject({ data: expect.any(String) });
  });
});

describe("Pablock SDK NFT Test", () => {
  it("should mint PablockNFT", async () => {
    jest.setTimeout(15000);

    let tx = await sdk.executeTransaction(
      await sdk.prepareTransaction(
        {
          address: sdk.getPablockContracts().PABLOCK_NFT,
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

    expect(tx).toMatchObject({
      from: expect.any(String),
      to: expect.any(String),
      transactionHash: expect.any(String),
      blockHash: expect.any(String),
    });
  });
  it("should have PablockNFTs", async () => {
    jest.setTimeout(15000);
    const contractAddress = sdk.getPablockContracts().PABLOCK_NFT;

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
    const contractAddress = sdk.getPablockContracts().PABLOCK_NFT;

    const tokens = await sdk2.getOwnedNFT([contractAddress]);
    // console.log("HIS TOKENS ==>", tokens);

    expect(!!tokens[contractAddress].find((el) => el.tokenId === tokenId)).toBe(
      true
    );
  });
});

describe("Pablock SDK Notarization Test", () => {
  it("should notarize hash (bundle)", async () => {
    jest.setTimeout(15000);
    const tx = await sdk.notarizeHash(
      "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
    );

    expect({ tx }).toMatchObject({ tx: expect.any(String) });
  });
});

describe("Pablock Hash module", () => {
  it("String hash", () => {
    expect(Hash.fromString("ciao")).toBe(
      "0xb133a0c0e9bee3be20163d2ad31d6248db292aa6dcb1ee087a2aa50e0fc75ae2"
    );
  });
  it("Buffer hash", () => {
    const file = fs.readFileSync("./README.md");
    expect(Hash.fromBuffer(file.buffer)).toBe(
      "0x8db73d440e8e3365692ffeaef0fb6a3c1cb8694a987ccd11382da30978bb2a69"
    );
  });
});
