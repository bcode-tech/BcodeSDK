'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var axios = require('axios');
var ethers = require('ethers');
var lodash = require('lodash');
var w3Abi = require('web3-eth-abi');
var merkletreejs = require('merkletreejs');
var CryptoJS = require('crypto-js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var w3Abi__default = /*#__PURE__*/_interopDefaultLegacy(w3Abi);
var CryptoJS__default = /*#__PURE__*/_interopDefaultLegacy(CryptoJS);

typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __async$1 = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const {
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityPack
} = require("ethers/lib/utils");
const { ecsign } = require("ethereumjs-util");
require("../config");
({
  token: {
    typehash: keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")),
    valueTypes: [
      "bytes32",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256"
    ],
    values: ["owner", "spender", "value", "nonce", "deadline"]
  },
  nft: {
    typehash: keccak256(toUtf8Bytes("Permit(address owner,address spender,uint256 tokenId,uint256 nonce,uint256 deadline)")),
    valueTypes: [
      "bytes32",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256"
    ],
    values: ["owner", "spender", "tokenId", "nonce", "deadline"]
  },
  notarization: {
    typehash: keccak256(toUtf8Bytes("Notarize(bytes32 hash, string memory uri, address applicant)")),
    valueTypes: ["bytes32", "bytes32", "string", "address"],
    values: ["hash", "uri", "applicant"]
  }
});
const sign = (digest, privateKey) => {
  return ecsign(Buffer.from(digest.slice(2), "hex"), privateKey);
};
function getDomainSeparator(name, version, contractAddress, chainId) {
  return keccak256(defaultAbiCoder.encode(["bytes32", "bytes32", "bytes32", "uint256", "address"], [
    keccak256(toUtf8Bytes("EIP712Domain(string name, string version, uint256 chainId, address verifyingContract)")),
    keccak256(toUtf8Bytes(name)),
    keccak256(toUtf8Bytes(version)),
    chainId,
    contractAddress
  ]));
}
function getTransactionData(nonce, functionSignature, publicKey, privateKey, contract) {
  return __async$1(this, null, function* () {
    const digest = keccak256(solidityPack(["bytes1", "bytes1", "bytes32", "bytes32"], [
      "0x19",
      "0x01",
      getDomainSeparator(contract.name, contract.version, contract.address, contract.chainId),
      keccak256(defaultAbiCoder.encode(["uint256", "address", "bytes32"], [
        nonce,
        publicKey,
        keccak256(Buffer.from(functionSignature.replace("0x", ""), "hex"))
      ]))
    ]));
    const signature = sign(digest, Buffer.from(privateKey.replace("0x", ""), "hex"));
    return signature;
  });
}

const { createLogger, format, transports } = require("winston");
const logFormat = format.combine(format.timestamp(), format.printf(({ level, message, timestamp }) => {
  return `[${level}] - ${message}`;
}));
const logger = createLogger({
  level: "debug",
  format: logFormat,
  transports: [
    new transports.Console()
  ]
});

var PablockNFT = {
  abi: [
    {
      inputs: [
        {
          internalType: "string",
          name: "_tokenName",
          type: "string"
        },
        {
          internalType: "string",
          name: "_tokenSymbol",
          type: "string"
        },
        {
          internalType: "address",
          name: "_pablockTokenAddress",
          type: "address"
        },
        {
          internalType: "address",
          name: "_metaTxAddress",
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
          name: "approved",
          type: "address"
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
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
          name: "owner",
          type: "address"
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address"
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool"
        }
      ],
      name: "ApprovalForAll",
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
          internalType: "string",
          name: "uri",
          type: "string"
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "",
          type: "uint256[]"
        }
      ],
      name: "TokenGeneration",
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
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "Transfer",
      type: "event"
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
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
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
      name: "baseURI",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
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
          name: "operator",
          type: "address"
        }
      ],
      name: "isApprovedForAll",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address"
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
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "safeTransferFrom",
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
          name: "tokenId",
          type: "uint256"
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes"
        }
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address"
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool"
        }
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4"
        }
      ],
      name: "supportsInterface",
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
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256"
        }
      ],
      name: "tokenByIndex",
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
          internalType: "uint256",
          name: "index",
          type: "uint256"
        }
      ],
      name: "tokenOfOwnerByIndex",
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
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "tokenURI",
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
          name: "contractAddr",
          type: "address"
        }
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
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
          name: "quantity",
          type: "uint256"
        },
        {
          internalType: "string",
          name: "_uri",
          type: "string"
        }
      ],
      name: "mintToken",
      outputs: [
        {
          internalType: "uint256[]",
          name: "indexes",
          type: "uint256[]"
        }
      ],
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
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "unlockToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256"
        }
      ],
      name: "isUnlocked",
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
    }
  ]
};

const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs";
const ERROR_TYPE = {
  NOT_INITIALIZE: "SDK not initialized",
  API_KEY_NOT_AUTHENTICATED: "API Key not authenticated",
  CONTRACT_ERROR: "Smart contract error",
  UNABLE_TO_GENERATE_SUB_JWT: "Unable to generate subJWT",
  UNABLE_TO_CHECK_TOKEN: "Unable to check token"
};
const PABLOCK_NFT_OBJ = {
  abi: PablockNFT.abi,
  name: "PablockNFT",
  version: "0.2.1"
};

var CustomERC20 = {
  abi: [
    {
      inputs: [
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
        },
        {
          internalType: "address",
          name: "_pablockTokenAddress",
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
      type: "function"
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
      type: "function"
    },
    {
      inputs: [],
      name: "TRANSFER_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32"
        }
      ],
      stateMutability: "view",
      type: "function"
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
      type: "function"
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
          name: "amount",
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
          name: "account",
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
      type: "function"
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function"
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
          name: "subtractedValue",
          type: "uint256"
        }
      ],
      name: "decreaseAllowance",
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
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256"
        }
      ],
      name: "increaseAllowance",
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
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
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
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
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
          name: "contractAddr",
          type: "address"
        }
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
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
      name: "transferToken",
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
      type: "function"
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
      stateMutability: "pure",
      type: "function"
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
      type: "function"
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
      name: "requestPermit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "hash",
          type: "bytes32"
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
      name: "verifySignature",
      outputs: [
        {
          internalType: "address",
          name: "signer",
          type: "address"
        }
      ],
      stateMutability: "pure",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address"
        }
      ],
      name: "getNonces",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    }
  ]
};

var PablockToken = {
  abi: [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_maxSupply",
          type: "uint256"
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
      type: "function"
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
      type: "function"
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
      type: "function"
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
          name: "amount",
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
          name: "account",
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
      type: "function"
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function"
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
          name: "subtractedValue",
          type: "uint256"
        }
      ],
      name: "decreaseAllowance",
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
          name: "spender",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "addedValue",
          type: "uint256"
        }
      ],
      name: "increaseAllowance",
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
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string"
        }
      ],
      stateMutability: "view",
      type: "function"
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
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
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
          name: "sender",
          type: "address"
        },
        {
          internalType: "address",
          name: "recipient",
          type: "address"
        },
        {
          internalType: "uint256",
          name: "amount",
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
      name: "requestToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_contract",
          type: "address"
        }
      ],
      name: "addContractToWhitelist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_contract",
          type: "address"
        }
      ],
      name: "removeContractFromWhitelist",
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
      inputs: [],
      name: "unlimitedApprove",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "addr",
          type: "address"
        }
      ],
      name: "receiveAndBurn",
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
          name: "_contract",
          type: "address"
        }
      ],
      name: "getContractStatus",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool"
        }
      ],
      stateMutability: "view",
      type: "function"
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
      name: "requestPermit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "addr",
          type: "address"
        }
      ],
      name: "getNonces",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
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
      type: "function"
    }
  ]
};

var config = {
  ENDPOINT_LOCAL: "http://127.0.0.1:8082",
  ENDPOINT_MUMBAI: "http://127.0.0.1:8082",
  ENDPOINT_POLYGON: "http://pablock-api.bcode.cloud",
  CHAIN_ID_LOCAL: 1,
  CHAIN_ID_MUMBAI: 80001,
  CHAIN_ID_POLYGON: 137,
  RPC_PROVIDER_LOCAL: "http://127.0.0.1:7545",
  RPC_PROVIDER_MUMBAI: "https://rpc-mumbai.maticvigil.com/",
  RPC_PROVIDER_POLYGON: "https://rpc-mainnet.maticvigil.com/",
  PABLOCK_TOKEN_ADDRESS_LOCAL: "0x9e0296fDfaB97c428507e36f077177EbDC4e5Faf",
  PABLOCK_META_TRANSACTION_LOCAL: "0x3A2faCBF588DA64Ef94D90049d529f3862b7a6fb",
  PABLOCK_NOTARIZATION_LOCAL: "0x4aC8ED5D389755b48992C2A3850727f8D878ed26",
  PABLOCK_NFT_LOCAL: "0x272B411731CDF59a87250bEEB0A8F7031E98b86D",
  PABLOCK_MULTISIGN_FACTORY_LOCAL: "0xc36E2D4a155066423bD6f51A53CAe753353aFd5d",
  TEST_META_TX_LOCAL: "0xbFa175f1930833dE77bcE8a185b48Cc60bDb81a4",
  PABLOCK_TOKEN_ADDRESS_MUMBAI: "0x4D47A9694389B1E42403FC5152E68d8D27803b14",
  PABLOCK_META_TRANSACTION_MUMBAI: "0x4419AF074BC3a6C7D90f242dfdC1a163Bc710091",
  PABLOCK_NOTARIZATION_MUMBAI: "0x8344F05f33AE80f1c03C8dc8f619719AcDe8cE49",
  PABLOCK_NFT_MUMBAI: "0x314Caa948A6BD160451e823510C467A8A330C074",
  PABLOCK_MULTISIGN_FACTORY_MUMBAI: "0x7296EE0F1036eC74eCF111E676e70eE97597A7d1",
  TEST_META_TX_MUMBAI: "0xE518725c53B4272d72c10b623A8443B62D19Ef1E",
  PABLOCK_TOKEN_ADDRESS_POLYGON: "0x284a7eF2ADD52890980E0173469FDE45d172bABD",
  PABLOCK_META_TRANSACTION_POLYGON: "0x5Dc63336bA6d4c1688E51e91fD7B002FC58C2dc9",
  PABLOCK_NOTARIZATION_POLYGON: "0xa347328B5b71eCFFcA8Da951AE2bDDa42F32066D",
  PABLOCK_NFT_POLYGON: "0x5979b9697C7ff4AD8925680a0998C449F070E962",
  PABLOCK_MULTISIGN_FACTORY_POLYGON: "0xDF4FEC568B4975AE4E39AAC576143d0E86dd2e1A",
  PABLOCK_ADDRESS_LOCAL: "0xfc8CFa30350f7B195f2b5c6F350f76720bfD89f4"
};

function fromString(input) {
  return CryptoJS__default['default'].SHA256(input).toString(CryptoJS__default['default'].enc.Hex);
}

var hash = /*#__PURE__*/Object.freeze({
  __proto__: null,
  fromString: fromString
});

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
typeof require !== "undefined" ? require : (x) => {
  throw new Error('Dynamic require of "' + x + '" is not supported');
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
function getWeb3Abi(w3Abi2) {
  return w3Abi2;
}
const web3Abi = getWeb3Abi(w3Abi__default['default']);
class PablockSDK {
  constructor(sdkOptions) {
    var _a, _b;
    if (!((_a = sdkOptions.config) == null ? void 0 : _a.debugMode)) {
      logger.transports[0].silent = true;
    }
    this.env = ((_b = sdkOptions.config) == null ? void 0 : _b.env) || "MUMBAI";
    logger.info(`Working environment: ${this.env}`);
    if (sdkOptions.apiKey) {
      this.apiKey = sdkOptions.apiKey;
    } else if (sdkOptions.authToken) {
      this.authToken = sdkOptions.authToken;
    } else {
      console.error("[Error] API key or auth token are required, please insert one!");
    }
    this.provider = new ethers.ethers.providers.JsonRpcProvider(config[`RPC_PROVIDER_${this.env}`]);
    if (sdkOptions.privateKey) {
      this.wallet = new ethers.ethers.Wallet(sdkOptions.privateKey);
    } else {
      this.wallet = ethers.ethers.Wallet.createRandom();
    }
    logger.info("Finished initialization");
  }
  init() {
    return __async(this, null, function* () {
      try {
        if (this.apiKey) {
          let { status, data } = yield axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/generateJWT/${this.apiKey}/${this.wallet.address}`);
          if (status === 200) {
            logger.info("Auth token received ");
            this.authToken = data.authToken;
          } else {
            logger.error(`[Init] Error: ${status}`);
            throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
          }
        } else if (this.authToken) {
          this.checkJWTValidity();
        }
      } catch (error) {
        logger.info("[Error] ", error);
        throw ERROR_TYPE.API_KEY_NOT_AUTHENTICATED;
      }
    });
  }
  getAuthToken() {
    logger.info(`Your auth token is: ${this.authToken}`);
    if (this.authToken) {
      return this.authToken;
    } else {
      console.error("[Error] run sdk.init() if you don't already do that, otherwise check if your API key is correct");
      return null;
    }
  }
  getApiKey() {
    logger.info(`Your API key is: ${this.apiKey}`);
    return this.apiKey;
  }
  getWalletAddress() {
    return this.wallet.address;
  }
  getWallet() {
    return this.wallet;
  }
  getPrivateKey() {
    return this.wallet.privateKey;
  }
  getPablockTokenBalance() {
    return __async(this, arguments, function* (address = this.wallet.address) {
      const pablockToken = new ethers.ethers.Contract(config[`PABLOCK_TOKEN_ADDRESS_${this.env}`], PablockToken.abi, this.provider);
      const balance = parseInt(ethers.ethers.utils.formatEther(yield pablockToken.balanceOf(address)));
      logger.info(`User has ${balance} PTK`);
      return balance;
    });
  }
  getTokenBalance() {
    return __async(this, arguments, function* (contractAddress = config[`CUSTOM_TOKEN_ADDRESS_${this.env}`], address = this.wallet.address) {
      try {
        const customToken = new ethers.ethers.Contract(contractAddress, CustomERC20.abi, this.provider);
        const balance = parseInt(ethers.ethers.utils.formatEther(yield customToken.balanceOf(address)));
        logger.info(`User has ${balance} ${yield customToken.name()}`);
        return balance;
      } catch (err) {
        logger.error("[Pablock API] Custom token balance: ", err);
        throw ERROR_TYPE.CONTRACT_ERROR;
      }
    });
  }
  getMaticBalance() {
    return __async(this, arguments, function* (address = this.wallet.address) {
      const balance = parseInt((yield this.provider.getBalance(address)).toString());
      logger.info(`User has ${balance} MATIC`);
      return balance;
    });
  }
  requestTestPTK() {
    return __async(this, null, function* () {
      logger.info(`Request 10 PTK for test from ${this.wallet.address}`);
      let { status, data } = yield axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/faucet/${this.wallet.address}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      logger.info(`Request token status: ${status}`);
      return data;
    });
  }
  requestToken(amount, contractAddress) {
    return __async(this, null, function* () {
      logger.info(`Request ${amount} token from ${this.wallet.address}`);
      let { status, data } = yield axios__default['default'].post(`${config[`ENDPOINT_${this.env}`]}/mintToken`, { contractAddress, to: this.wallet.address, amount }, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      logger.info(`Request token status: ${status}`);
      return data;
    });
  }
  mintPablockNFT(amount, uri, optionals) {
    return __async(this, null, function* () {
      try {
        const tx = yield this.prepareTransaction(__spreadProps(__spreadValues({}, PABLOCK_NFT_OBJ), { address: config[`PABLOCK_NFT_${this.env}`] }), "mintToken", [this.wallet.address, amount, uri]);
        const receipt = yield this.executeTransaction(tx, optionals);
        return receipt;
      } catch (err) {
        logger.error(`NFTMint error: ${err} `);
        return null;
      }
    });
  }
  sendPablockNFT(to, tokenId, optionals) {
    return __async(this, null, function* () {
      try {
        const tx = yield this.prepareTransaction(__spreadProps(__spreadValues({}, PABLOCK_NFT_OBJ), { address: config[`PABLOCK_NFT_${this.env}`] }), "transferFrom", [this.wallet.address, to, tokenId]);
        const receipt = yield this.executeTransaction(tx, optionals);
        return receipt;
      } catch (err) {
        logger.error(`NFTTransfer error: ${err} `);
        return null;
      }
    });
  }
  prepareTransaction(contractObj, functionName, params) {
    return __async(this, null, function* () {
      logger.info(`[Prepare Tranaction]`);
      logger.info(`${contractObj.address}
${contractObj.name}
${contractObj.version}`);
      logger.info(` ${functionName}`);
      let functionSignature = web3Abi.encodeFunctionCall(contractObj.abi.find((el) => el.type === "function" && el.name === functionName), params);
      const { data } = yield axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/getNonce/${this.wallet.address}`, {
        headers: { Authorization: `Bearer ${this.authToken}` }
      });
      let { r, s, v } = yield getTransactionData(data.nonce, functionSignature, this.wallet.address, this.wallet.privateKey, {
        name: contractObj.name,
        version: contractObj.version,
        address: contractObj.address,
        chainId: config[`CHAIN_ID_${this.env}`]
      });
      return {
        contractAddress: contractObj.address,
        userAddress: this.wallet.address,
        functionSignature,
        r: `0x${r.toString("hex")}`,
        s: `0x${s.toString("hex")}`,
        v
      };
    });
  }
  executeTransaction(tx, optionals) {
    return __async(this, null, function* () {
      try {
        const { status, data } = yield axios__default['default'].post(`${config[`ENDPOINT_${this.env}`]}/sendRawTransaction`, __spreadValues({
          tx
        }, optionals), { headers: { Authorization: `Bearer ${this.authToken}` } });
        if (status === 200) {
          logger.info("[Execute Transaction] Success");
          return data.tx;
        }
      } catch (err) {
        logger.error(`[Execute Transaction] Error: ${err}`);
        return null;
      }
    });
  }
  executeAsyncTransaction(tx, optionals) {
    return __async(this, null, function* () {
      const { status, data } = yield axios__default['default'].post(`${config[`ENDPOINT_${this.env}`]}/sendRawTransactionAsync`, __spreadValues({
        tx
      }, optionals), { headers: { Authorization: `Bearer ${this.authToken}` } });
      return data.requestId;
    });
  }
  notarizeHash(hash) {
    return __async(this, null, function* () {
      try {
        const { status, data } = yield axios__default['default'].post(`${config[`ENDPOINT_${this.env}`]}/notarize`, {
          hash
        }, { headers: { Authorization: `Bearer ${this.authToken}` } });
        if (status === 200) {
          return data.requestId;
        } else {
          logger.error(`Notarization error, status code ${status} `);
        }
      } catch (err) {
        logger.error(`Notarization error: ${err} `);
        return null;
      }
    });
  }
  checkBundledNotarization(requestId, returnParams) {
    return __async(this, null, function* () {
      let {
        status,
        data: { hash, ipfsMerkleTree }
      } = yield axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/checkNotarizationTree/${requestId}`, {
        headers: {
          Authorization: `Bearer ${this.authToken}`
        }
      });
      let { data: leaves } = yield axios__default['default'].get(`${IPFS_GATEWAY}/${ipfsMerkleTree}`);
      let merkleTree = new merkletreejs.MerkleTree(leaves.map((leaf) => leaf));
      const merkleRoot = merkleTree.getHexRoot();
      const merkleProof = merkleTree.getProof(hash);
      const inclusion = merkleTree.verify(merkleProof, hash, merkleRoot);
      return returnParams.length ? lodash.pick({
        leaves,
        merkleRoot,
        hash,
        merkleProof,
        inclusion
      }, returnParams) : {
        leaves,
        merkleRoot,
        hash,
        merkleProof,
        inclusion
      };
    });
  }
  getContract(address, abi) {
    var _a;
    return new ethers.ethers.Contract(address, abi, (_a = this.wallet) == null ? void 0 : _a.connect(this.provider));
  }
  getOwnedNFT(_0) {
    return __async(this, arguments, function* (contractAddresses, ownerAddress = this.wallet.address) {
      let tokenOfOwner = {};
      for (const addr of contractAddresses) {
        let contract = new ethers.ethers.Contract(addr, PablockNFT.abi, this.wallet.connect(this.provider));
        let balance = yield contract.balanceOf(ownerAddress);
        logger.info(`User has ${balance} NFTs in ${addr} contract`);
        let tokenIds = [];
        for (const i of lodash.range(balance)) {
          const tokenId = yield contract.tokenOfOwnerByIndex(ownerAddress, i);
          tokenIds.push({
            tokenId: tokenId.toString(),
            tokenURI: yield contract.tokenURI(tokenId.toString())
          });
        }
        tokenOfOwner[addr] = tokenIds;
      }
      return tokenOfOwner;
    });
  }
  checkJWTValidity() {
    return __async(this, null, function* () {
      try {
        let { status, data } = yield axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/checkJWT`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        });
        logger.info(status, data);
        return data.auth;
      } catch (error) {
        throw ERROR_TYPE.UNABLE_TO_CHECK_TOKEN;
      }
    });
  }
  generateSubJWT(address) {
    return __async(this, null, function* () {
      try {
        let { status, data } = yield axios__default['default'].get(`${config[`ENDPOINT_${this.env}`]}/generateSubJWT/${address}`, {
          headers: {
            Authorization: `Bearer ${this.authToken}`
          }
        });
        console.log(data);
        logger.info(`SubJWT: ${data.authToken}`);
        return data.authToken;
      } catch (error) {
        throw ERROR_TYPE.UNABLE_TO_GENERATE_SUB_JWT;
      }
    });
  }
  getAPIVersion() {
    return __async(this, null, function* () {
      let { data } = yield axios__default['default'].get(`/getVersion`);
      return data;
    });
  }
}

exports.Hash = hash;
exports.PablockSDK = PablockSDK;
//# sourceMappingURL=index.js.map
