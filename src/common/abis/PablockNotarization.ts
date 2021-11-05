export default {
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_pablockToken",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "bytes32",
          name: "hash",
          type: "bytes32",
        },
        {
          indexed: false,
          internalType: "string",
          name: "uri",
          type: "string",
        },
        {
          indexed: false,
          internalType: "address",
          name: "applicant",
          type: "address",
        },
      ],
      name: "Notarize",
      type: "event",
    },
    {
      inputs: [],
      name: "NOTARIZE_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
      constant: true,
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "contractAddr",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "hash",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "uri",
          type: "string",
        },
        {
          internalType: "address",
          name: "applicant",
          type: "address",
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8",
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
        },
      ],
      name: "notarize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
