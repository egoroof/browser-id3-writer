const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer.min');

const emptyBuffer = new ArrayBuffer(0);
const id3Header = [
    73, 68, 51, // ID3 magic nubmer
    3, 0, // version
    0, // flags
];

describe('TYER', () => {
    it('TYER', () => {
        const writer = new ID3Writer(emptyBuffer);
        writer.padding = 0;
        writer.setFrame('TYER', 2011);
        writer.addTag();
        const actual = new Uint8Array(writer.arrayBuffer);
        const expected = new Uint8Array([
            ...id3Header,
            0, 0, 0, 15, // tag size without header
            84, 89, 69, 82, // TYER
            0, 0, 0, 5, // frame size without header
            0, 0, // flags
            0, // encoding
            50, 48, 49, 49, // 2011
        ]);
        assert.deepStrictEqual(actual, expected);
    });
});
