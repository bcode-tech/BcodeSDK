const { PablockSDK } = require("../build");

const config = require("../config.json");

// NodeMonkey();

const sdk = new PablockSDK({
  apiKey: "api_test",
  privateKey:
    "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1",
  config: { env: "MUMBAI", debugMode: true },
});

(async () => {
  await sdk.init();
  console.log(await sdk.getWalletAddress());
})();
