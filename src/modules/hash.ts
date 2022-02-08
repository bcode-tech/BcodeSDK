import CryptoJS from "crypto-js";

export function fromString(input: string): string {
  return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}
