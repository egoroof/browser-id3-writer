const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
// prettier-ignore
const id3Header = [
  73, 68, 51, // ID3 magic nubmer
  3, 0, // version
  0, // flags
];

describe('TKEY', () => {
  it('TKEY', () => {
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('TKEY', 'C#');
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    // prettier-ignore
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 17, // tag size without header
      84, 75, 69, 89, // TKEY
      0, 0, 0, 7, // size without header
      0, 0, // flags
      1, // encoding
      255, 254, // BOM
      67, 0, 35, 0, // C#
    ]);
    assert.deepStrictEqual(actual, expected);
  });
});
