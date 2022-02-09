import QRCode from "qrcode";

/**
 * @description Take string as input and return QRCode buffer that has been generated
 * @param input
 * @returns ArrayBufferLike buffer of QRCode
 */
export function fromString(input: string): { [any: string]: any } {
  const buffer = async () => {
    let enc = new TextEncoder();
    return enc.encode(await QRCode.toString(input)).buffer;
  };
  const print = async () => console.log(await QRCode.toString(input));

  return { buffer, print };
}
