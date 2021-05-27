const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer');

const emptyBuffer = new ArrayBuffer(0);
const id3Header = [
  73, 68, 51, // ID3 magic nubmer
  3, 0, // version
  0, // flags
];

describe('USLT', () => {
  it('USLT', () => {
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('USLT', {
      description: 'Ярл',
      lyrics: 'Лирика',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 38, // tag size without header
      85, 83, 76, 84, // 'USLT'
      0, 0, 0, 28, // size without header
      0, 0, // flags
      1, // encoding
      101, 110, 103, // language
      0xff, 0xfe, // BOM
      47, 4, 64, 4, 59, 4, // 'Ярл'
      0, 0, 0xff, 0xfe, // separator, BOM
      27, 4, 56, 4, 64, 4, 56, 4, 58, 4, 48, 4, // 'Лирика'
    ]);
    assert.deepStrictEqual(actual, expected);
  });
  it('Change language', () => {
    const writer = new ID3Writer(emptyBuffer);
    writer.padding = 0;
    writer.setFrame('USLT', {
      language: 'rus',
      description: 'Ярл',
      lyrics: 'Лирика',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      0, 0, 0, 38, // tag size without header
      85, 83, 76, 84, // 'USLT'
      0, 0, 0, 28, // size without header
      0, 0, // flags
      1, // encoding
      114, 117, 115, // language
      0xff, 0xfe, // BOM
      47, 4, 64, 4, 59, 4, // 'Ярл'
      0, 0, 0xff, 0xfe, // separator, BOM
      27, 4, 56, 4, 64, 4, 56, 4, 58, 4, 48, 4, // 'Лирика'
    ]);
    assert.deepStrictEqual(actual, expected);
  });
});
