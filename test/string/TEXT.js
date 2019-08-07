const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
const id3Header = [
    73, 68, 51, // ID3 magic number
    3, 0, // version
    0, // flags
];

describe('TEXT', () => {
    it('TEXT', () => {
        const writer = new ID3Writer(emptyBuffer);
        writer.padding = 0;
        writer.setFrame('TEXT', 'Lyricist/Text writer');
        writer.addTag();
        const actual = new Uint8Array(writer.arrayBuffer);
        const expected = new Uint8Array([
            ...id3Header,
            0, 0, 0, 53, // tag size without header
            84, 69, 88, 84, // TEXT
            0, 0, 0, 43, // frame size without header
            0, 0, // flags
            1, 0xff, 0xfe, // encoding, BOM
            76, 0, 121, 0, 114, 0, 105, 0, 99, 0, 105, 0, 115, 0, 116, 0, 47, 0, 84, 0, 101,
            0, 120, 0, 116, 0, 32, 0, 119, 0, 114, 0, 105, 0, 116, 0, 101, 0, 114, 0,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
});
