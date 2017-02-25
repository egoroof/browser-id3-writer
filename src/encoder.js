// https://encoding.spec.whatwg.org/

export function encodeWindows1252(str) {
    const codePoints = String(str).split('').map((c) => c.charCodeAt(0));

    return new Uint8Array(codePoints);
}

export function encodeUtf16le(str) {
    const codePoints = String(str).split('').map((c) => c.charCodeAt(0));
    const output = new Uint8Array(str.length * 2);

    new Uint16Array(output.buffer).set(codePoints);

    return output;
}
