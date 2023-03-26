const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
// prettier-ignore
const id3Header = [
  73, 68, 51, // ID3 magic nubmer
  3, 0, // version
  0, // flags
];

describe('TIT2', () => {
  it('TIT2', () => {
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('TIT2', 'Forge');
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    // prettier-ignore
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 23, // tag size without header
      84, 73, 84, 50, // TIT2
      0, 0, 0, 13, // frame size without header
      0, 0, // flags
      1, 0xff, 0xfe, // encoding, BOM
      70, 0, 111, 0, 114, 0, 103, 0, 101, 0,
    ]);
    assert.deepStrictEqual(actual, expected);
  });
});
