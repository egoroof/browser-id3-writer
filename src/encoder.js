// https://encoding.spec.whatwg.org/

function encodeWindows1252(str) {
    const codePoints = String(str).split('').map((c) => c.charCodeAt(0));

    return new Uint8Array(codePoints);
}

function encodeUtf16le(str) {
    const codePoints = String(str).split('').map((c) => c.charCodeAt(0));
    const output = new Uint8Array(str.length * 2);

    new Uint16Array(output.buffer).set(codePoints);

    return output;
}

module.exports = {
    encodeWindows1252,
    encodeUtf16le
};
