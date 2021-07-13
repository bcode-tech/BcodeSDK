'use strict';

var axios = require('axios');
var ethers = require('ethers');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);

const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxSupply",
        type: "uint256"
      },
      {
        internalType: "string",
        name: "_name",
        type: "string"
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string"
      },
      {
        internalType: "address",
        name: "_owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "_delegate",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "guy",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "dst",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "src",
        type: "address"
      },
      {
        internalType: "address",
        name: "dst",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "wad",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "version",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "pure",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "mintQuantity",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address"
      }
    ],
    name: "addDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address"
      }
    ],
    name: "removeDelegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address"
      }
    ],
    name: "changeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxSupply",
        type: "uint256"
      }
    ],
    name: "changeMaxSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transferToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address"
      }
    ],
    name: "getDelegateStatus",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "getVersion",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "getChainId",
    outputs: [
      {
        internalType: "uint256",
        name: "chain",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  }
];

const {
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityPack
} = require("ethers/lib/utils");
const { ecsign } = require("ethereumjs-util");
const PERMIT_TYPEHASH = keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"));
const sign = (digest, privateKey) => {
  return ecsign(Buffer.from(digest.slice(2), "hex"), privateKey);
};
function getPermitDigest(name, address, chainId, approve, nonce, deadline) {
  const DOMAIN_SEPARATOR = getDomainSeparator(name, address, chainId);
  return keccak256(solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"], [
    "0x19",
    "0x01",
    DOMAIN_SEPARATOR,
    keccak256(defaultAbiCoder.encode(["bytes32", "address", "address", "uint256", "uint256", "uint256"], [
      PERMIT_TYPEHASH,
      approve.owner,
      approve.spender,
      approve.value,
      nonce,
      deadline
    ]))
  ]));
}
function getDomainSeparator(name, contractAddress, chainId) {
  return keccak256(defaultAbiCoder.encode(["bytes32", "bytes32", "bytes32", "uint256", "address"], [
    keccak256(toUtf8Bytes("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)")),
    keccak256(toUtf8Bytes(name)),
    keccak256(toUtf8Bytes("1")),
    chainId,
    contractAddress
  ]));
}

const ERROR_TYPE = {
  NOT_INITIALIZE: "SDK not initialized",
  API_KEY_NOT_AUTHENTICATED: "API Key not authenticated"
};

var ENDPOINT_LOCAL="http://127.0.0.1:8082/";var ENDPOINT_DEV="http://127.0.0.1:8082/";var ENDPOINT_PROD="http://127.0.0.1:8082/";var config = {ENDPOINT_LOCAL:ENDPOINT_LOCAL,ENDPOINT_DEV:ENDPOINT_DEV,ENDPOINT_PROD:ENDPOINT_PROD};

class PablockSDK {
  constructor(sdkOptions) {
    console.log(config["ENDPOINT_DEV"]);
    this.apiKey = sdkOptions.apiKey;
    this.env = sdkOptions.config?.env || "LOCAL";
    if (sdkOptions.privateKey) {
      this.wallet = new ethers.ethers.Wallet(sdkOptions.privateKey);
      this.provider = new ethers.ethers.providers.JsonRpcProvider(config[`RPC_PROVIDER_${this.env}`]);
    } else {
      this.wallet = ethers.ethers.Wallet.createRandom();
    }
  }
  async init() {
    try {
      let { status, data } = await axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}generateJWT/${this.apiKey}`);
      if (status === 200) {
        this.authToken = data.authToken;
      } else {
        throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
      }
    } catch (error) {
      console.log(error);
      throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
    }
  }
  getAuthToken() {
    console.log("AUTH TOKEN ==>", this.authToken);
  }
  getApiKey() {
    console.log("API KEY ==>", this.apiKey);
  }
  async sendToken(contractAddress, spender, value, deadline, config2) {
    const customERC20 = new ethers.ethers.Contract(contractAddress, abi, this.provider);
    const approve = {
      owner: this.wallet.address,
      spender,
      value
    };
    const nonce = parseInt((await customERC20.nonces(approve.owner)).toString());
    const digest = getPermitDigest(await customERC20.name(), customERC20.address, parseInt(await customERC20.getChainId()), approve, nonce, deadline);
    const { v, r, s } = sign(digest, Buffer.from(this.wallet.privateKey.substring(2), "hex"));
    const tx = await customERC20.populateTransaction.permit(approve.owner, approve.spender, approve.value, deadline, v, r, s, { gasLimit: 3e5, gasPrice: 1e9 });
    let { status, data } = await axios__default['default'].post(`${config2[`ENDPOINT_${this.env}`]}/sendToken`, { tx, contractAddress, address: this.wallet.address }, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
    return data;
  }
  async requestToken(contractAddress, to, amount) {
    let { status, data } = await axios__default['default'].post(`${config[`ENDPOINT_${this.env}`]}/mintToken`, { contractAddress, to, amount }, {
      headers: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
    return data;
  }
}

module.exports = PablockSDK;
//# sourceMappingURL=index.js.map
