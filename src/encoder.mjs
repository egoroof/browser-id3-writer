// https://encoding.spec.whatwg.org/

export function strToCodePoints(str) {
  return String(str)
    .split('')
    .map((c) => c.charCodeAt(0));
}

export function encodeWindows1252(str) {
  return new Uint8Array(strToCodePoints(str));
}

export function encodeUtf16le(str) {
  const buffer = new ArrayBuffer(str.length * 2);
  const u8 = new Uint8Array(buffer);
  const u16 = new Uint16Array(buffer);

  u16.set(strToCodePoints(str));
  return u8;
}
