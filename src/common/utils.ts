const {
  keccak256,
  defaultAbiCoder,
  toUtf8Bytes,
  solidityPack,
} = require("ethers/lib/utils");
const { ecsign } = require("ethereumjs-util");

const config = require("../config");

const DIGEST_DATA = {
  token: {
    typehash: keccak256(
      toUtf8Bytes(
        "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
      )
    ),
    valueTypes: [
      "bytes32",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256",
    ],
    values: ["owner", "spender", "value", "nonce", "deadline"],
  },
  nft: {
    typehash: keccak256(
      toUtf8Bytes(
        "Permit(address owner,address spender,uint256 tokenId,uint256 nonce,uint256 deadline)"
      )
    ),
    valueTypes: [
      "bytes32",
      "address",
      "address",
      "uint256",
      "uint256",
      "uint256",
    ],
    values: ["owner", "spender", "tokenId", "nonce", "deadline"],
  },
  notarization: {
    typehash: keccak256(
      toUtf8Bytes(
        "Notarize(bytes32 hash, string memory uri, address applicant)"
      )
    ),
    valueTypes: ["bytes32", "bytes32", "string", "address"],
    values: ["hash", "uri", "applicant"],
  },
};

export const sign = (digest: string, privateKey: Buffer) => {
  return ecsign(Buffer.from(digest.slice(2), "hex"), privateKey);
};

type Approve = {
  owner: string;
  spender: string;
  value?: number;
  tokenId?: number;
};

type Data = {
  approve?: Approve;
  nonce?: number;
  deadline?: number;
  hash?: string;
  uri?: string;
  applicant?: string;
};

// Returns the EIP712 hash which should be signed by the user
// in order to make a call to `permit`
export function getPermitDigest(
  name: string,
  address: string,
  chainId: number,
  data: Data,
  contractType: "nft" | "token" | "notarization"
) {
  const DOMAIN_SEPARATOR = getDomainSeparator(name, "0.1.0", address, chainId);

  const digestData = DIGEST_DATA[contractType];

  return keccak256(
    solidityPack(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      [
        "0x19",
        "0x01",
        DOMAIN_SEPARATOR,
        keccak256(
          defaultAbiCoder.encode(digestData.valueTypes, [
            digestData.typehash,
            ...digestData.values.map((el) => data[el] || data.approve?.[el]),
          ])
        ),
      ]
    )
  );
}

// // Gets the EIP712 domain separator
// export function getDomainSeparator(
//   name: string,
//   contractAddress: string,
//   chainId: number
// ) {
//   return keccak256(
//     defaultAbiCoder.encode(
//       ["bytes32", "bytes32", "bytes32", "uint256", "address"],
//       [
//         keccak256(
//           toUtf8Bytes(
//             "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
//           )
//         ),
//         keccak256(toUtf8Bytes(name)),
//         keccak256(toUtf8Bytes("1")),
//         chainId,
//         contractAddress,
//       ]
//     )
//   );
// }

export function getDomainSeparator(
  name: string,
  version: string,
  contractAddress: string,
  chainId: number
) {
  return keccak256(
    defaultAbiCoder.encode(
      ["bytes32", "bytes32", "bytes32", "uint256", "address"],
      [
        keccak256(
          toUtf8Bytes(
            "EIP712Domain(string name, string version, uint256 chainId, address verifyingContract)"
          )
        ),
        keccak256(toUtf8Bytes(name)),
        keccak256(toUtf8Bytes(version)),
        chainId,
        contractAddress,
      ]
    )
  );
}

export async function getTransactionData(
  nonce: number,
  functionSignature: string,
  publicKey: string,
  privateKey: string,
  contract: { name: string; version: string; address: string; chainId: number }
) {
  const digest = keccak256(
    solidityPack(
      ["bytes1", "bytes1", "bytes32", "bytes32"],
      [
        "0x19",
        "0x01",
        getDomainSeparator(
          contract.name,
          contract.version,
          contract.address,
          contract.chainId
        ),
        keccak256(
          defaultAbiCoder.encode(
            ["uint256", "address", "bytes32"],
            [
              nonce,
              publicKey,
              keccak256(
                Buffer.from(functionSignature.replace("0x", ""), "hex")
              ),
            ]
          )
        ),
      ]
    )
  );

  const signature = sign(
    digest,
    Buffer.from(privateKey.replace("0x", ""), "hex")
  );

  return signature;
}
