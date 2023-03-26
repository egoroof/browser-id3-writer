const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
// prettier-ignore
const id3Header = [
  73, 68, 51, // ID3 magic nubmer
  3, 0, // version
  0, // flags
];

describe('TPE1', () => {
  it('TPE1', () => {
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('TPE1', ['Eminem', '50 Cent']);
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    // prettier-ignore
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 41, // tag size without header
      84, 80, 69, 49, // TPE1
      0, 0, 0, 31, // frame size without header
      0, 0, // flags
      1, 0xff, 0xfe, // encoding, BOM
      69, 0, 109, 0, 105, 0, 110, 0, 101, 0, 109, 0, 47, 0, // Eminem/
      53, 0, 48, 0, 32, 0, 67, 0, 101, 0, 110, 0, 116, 0, // 50 Cent
    ]);
    assert.deepStrictEqual(actual, expected);
  });
  it('Throw with wrong frame value', () => {
    const writer = new ID3Writer(emptyBuffer);
    assert.throws(() => {
      writer.setFrame('TPE1', 'hey');
    }, /TPE1 frame value should be an array of strings/);
  });
});
