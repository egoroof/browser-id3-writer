const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
// prettier-ignore
const id3Header = [
  73, 68, 51, // ID3 magic nubmer
  3, 0, // version
  0, // flags
];

describe('COMM', () => {
  it('COMM', () => {
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('COMM', {
      description: 'advert',
      text: 'free hugs',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    // prettier-ignore
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 50, // tag size without header
      67, 79, 77, 77, // 'COMM'
      0, 0, 0, 40, // size without header
      0, 0, // flags
      1, 101, 110, 103, 0xff, 0xfe, // encoding, language, BOM
      97, 0, 100, 0, 118, 0, 101, 0, 114, 0, 116, 0, // 'advert'
      0, 0, 0xff, 0xfe, // separator, BOM
      102, 0, 114, 0, 101, 0, 101, 0, 32, 0, 104, 0, 117, 0, 103, 0, 115, 0, // 'free hugs'
    ]);
    assert.deepStrictEqual(actual, expected);
  });
  it('Change language', () => {
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('COMM', {
      language: 'jpn',
      description: 'この世界',
      text: '俺の名前',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    // prettier-ignore
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 36, // tag size without header
      67, 79, 77, 77, // 'COMM'
      0, 0, 0, 26, // size without header
      0, 0, // flags
      1, 106, 112, 110, 0xff, 0xfe, // encoding, language, BOM
      83, 48, 110, 48, 22, 78, 76, 117, // 'この世界'
      0, 0, 0xff, 0xfe, // separator, BOM
      250, 79, 110, 48, 13, 84, 77, 82, // '俺の名前'
    ]);
    assert.deepStrictEqual(actual, expected);
  });
});
