import CryptoJS from "crypto-js";

/**
 * @description Take string as input and return the SHA256 hash of the string
 * @param input
 * @returns hash string
 */
export function fromString(input: string): string {
  return `0x${CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex)}`;
}

/**
 * @descrioption Take buffer from File type and return SHA256 hash of the buffer
 * @param input
 * @returns hash string
 *
 * @example  const file = fs.readFileSync("./tests/Blue_Icon.png");
 */
export function fromBuffer(file: number[]): string {
  const wordArray = CryptoJS.lib.WordArray.create(file);
  return `0x${CryptoJS.SHA256(wordArray).toString(CryptoJS.enc.Hex)}`;
}
