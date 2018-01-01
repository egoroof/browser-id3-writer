const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
const id3Header = [
    73, 68, 51, // ID3 magic nubmer
    3, 0, // version
    0, // flags
];

describe('TXXX', () => {
    it('TXXX', () => {
        const writer = new ID3Writer(emptyBuffer);
        writer.padding = 0;
        writer.setFrame('TXXX', {
            description: 'foo',
            value: 'bar',
        });
        writer.addTag();
        const actual = new Uint8Array(writer.arrayBuffer);
        const expected = new Uint8Array([
            ...id3Header,
            0, 0, 0, 29, // tag size without header
            84, 88, 88, 88, // 'TXXX'
            0, 0, 0, 19, // size without header
            0, 0, // flags
            1, 0xff, 0xfe, // encoding, BOM
            102, 0, 111, 0, 111, 0, // 'foo'
            0, 0, 0xff, 0xfe, // separator, BOM
            98, 0, 97, 0, 114, 0, // 'bar'
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('Throw with simple string', () => {
        const writer = new ID3Writer(emptyBuffer);
        assert.throws(() => {
            writer.setFrame('TXXX', 'foobar');
        }, /TXXX frame value should be an object with keys description and value/);
    });
    it('Throw when no description provided', () => {
        const writer = new ID3Writer(emptyBuffer);
        assert.throws(() => {
            writer.setFrame('TXXX', {
                value: 'foobar',
            });
        }, /TXXX frame value should be an object with keys description and value/);
    });
    it('Throw when no value provided', () => {
        const writer = new ID3Writer(emptyBuffer);
        assert.throws(() => {
            writer.setFrame('TXXX', {
                description: 'foobar',
            });
        }, /TXXX frame value should be an object with keys description and value/);
    });
});
