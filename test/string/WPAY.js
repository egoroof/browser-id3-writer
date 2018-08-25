const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer.min');

const emptyBuffer = new ArrayBuffer(0);
const id3Header = [
    73, 68, 51, // ID3 magic nubmer
    3, 0, // version
    0, // flags
];

describe('WPAY', () => {
    it('WPAY', () => {
        const writer = new ID3Writer(emptyBuffer);
        writer.padding = 0;
        writer.setFrame('WPAY', 'https://google.com');
        writer.addTag();
        const actual = new Uint8Array(writer.arrayBuffer);
        const expected = new Uint8Array([
            ...id3Header,
            0, 0, 0, 28, // tag size without header
            87, 80, 65, 89, // 'WPAY'
            0, 0, 0, 18, // size without header
            0, 0, // flags
            104, 116, 116, 112, 115, 58, 47, 47, 103, 111, 111, 103, 108, 101, 46, 99, 111, 109, // https://google.com
        ]);
        assert.deepStrictEqual(actual, expected);
    });
});
