const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
// prettier-ignore
const id3Header = [
  73, 68, 51, // ID3 magic number
  3, 0, // version
  0, // flags
];

describe('PRIV', () => {
  it('PRIV', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('PRIV', {
      id: 'site.com',
      data,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    // prettier-ignore
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 28, // tag size without header
      80, 82, 73, 86, // 'PRIV'
      0, 0, 0, 18, // size without header
      0, 0, // flags
      115, 105, 116, 101, 46, 99, 111, 109, // id
      0, // separator
      1, 2, 3, 4, 5, 6, 7, 8, 9, // frame data
    ]);
    assert.deepStrictEqual(actual, expected);
  });
});
