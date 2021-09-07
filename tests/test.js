const { ethers } = require("ethers");
const { PablockSDK } = require("../build");

const axios = require("axios");

// (async () => {
//   const sdk = new PablockSDK({
//     apiKey: "xdx",
//     privateKey:
//       "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1",
//     config: { network: "DEV" },
//   });

//   console.log(
//     new PablockSDK({
//       apiKey: "xdx",
//       privateKey:
//         "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1",
//       config: { network: "DEV" },
//     }).getApiKey()
//   );

// await sdk.sendToken(
//   "0x0932a1D86dea2e3C235a192c918bf3f14B12303b",
//   "0xfc8CFa30350f7B195f2b5c6F350f76720bfD89f4",
//   1,
//   1657121546000
// );

// await sdk.requestToken(
//   "0x0932a1D86dea2e3C235a192c918bf3f14B12303b",
//   "0x5d1305A4EEE866c6b3C3Cf25ad70392b6459f2cD",
//   10
// );

// const { data } = await axios.get("http://127.0.0.1:8082/generateJWT/prova");

// const response = await axios.get(
//   "http://127.0.0.1:8082/generateSubJWT",
//   // { id: "pincopallino", apiKey: "prova" },
//   { headers: { Authorization: `Bearer ${data.authToken}` } }
// );

// console.log(response);
// })();

describe("Base tests", () => {
  it("should create Library", () => {
    expect(
      new PablockSDK({
        apiKey: "xdx",
        privateKey:
          "0xfc0846a4e1d827c9c7a1fd8f255074d01bb019760a2065e0756b578dde00ecf1",
        config: { network: "LOCAL" },
      }).getApiKey()
    ).toBe("xdx");
  });
});
