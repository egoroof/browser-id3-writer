const assert = require('assert');
const ID3Writer = require('../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
const id3Header = [
    73, 68, 51, // ID3 magic nubmer
    3, 0, // version
    0, // flags
];

describe('Commom usage', () => {
    it('Copy data from buffer, add padding and tags', () => {
        const payload = new Uint8Array([1, 2, 3]);
        const writer = new ID3Writer(payload.buffer);
        writer.padding = 5;
        writer.setFrame('TIT2', 'Home')
            .setFrame('TPE1', ['Eminem']);
        writer.addTag();
        const actual = new Uint8Array(writer.arrayBuffer);
        const expected = new Uint8Array([
            ...id3Header,
            0, 0, 0, 51, // tag size without header
            84, 73, 84, 50, // TIT2
            0, 0, 0, 11, // size of tit2 without header
            0, 0, // flags
            1, 255, 254, // encoding, bom
            72, 0, 111, 0, 109, 0, 101, 0, // "Home"
            84, 80, 69, 49, // TPE1
            0, 0, 0, 15, // size of tpe1 without header
            0, 0, // flags
            1, 255, 254, // encoding, bom
            69, 0, 109, 0, 105, 0, 110, 0, 101, 0, 109, 0, // "Eminem"
            0, 0, 0, 0, 0, // padding
            1, 2, 3, // payload
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('Throw with wrong frame name', () => {
        const writer = new ID3Writer(emptyBuffer);
        assert.throws(() => {
            writer.setFrame('yoyo', 'hey');
        }, /Unsupported frame/);
    });
    it('Throw if no argument passed to constructor', () => {
        assert.throws(() => {
            new ID3Writer();
        }, /First argument should be an instance of ArrayBuffer or Buffer/);
    });
});
