function encodeUtf8Ascii(str) {
    const codePoints = String(str).split('').map((c) => c.charCodeAt(0)); // up to 0x7F

    return new Uint8Array(codePoints);
}

function encodeUtf16le(str) {
    const codePoints = String(str).split('').map((c) => c.charCodeAt(0));
    const output = new Uint8Array(str.length * 2);

    new Uint16Array(output.buffer).set(codePoints);

    return output;
}

module.exports = {
    encodeUtf8Ascii,
    encodeUtf16le
};
