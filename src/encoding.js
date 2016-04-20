function encodeUtf8Ascii(str) {
    const codePoints = str.split('').map((c) => {
        const charCode = c.charCodeAt(0);
        if (charCode > 0x7F) {
            throw new Error('Trying to encode not ASCII symbol');
        }
        return charCode;
    });

    return new Uint8Array(codePoints);
}

function encodeUtf16le(str) {
    const codePoints = str.split('').map((c) => c.charCodeAt(0));
    const output = new Uint8Array(str.length * 2);

    new Uint16Array(output.buffer).set(codePoints);

    return output;
}

module.exports = {
    encodeUtf8Ascii,
    encodeUtf16le
};
