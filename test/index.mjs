import { deepStrictEqual, throws } from 'assert';
import { getEmptyBuffer, id3Header } from './utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../src/encoder.mjs';
import ID3Writer from '../dist/browser-id3-writer.js';

describe('Commom usage', () => {
  it('Copy data from buffer, add padding and tags', () => {
    const payload = new Uint8Array([1, 2, 3]);
    const writer = new ID3Writer(payload.buffer);
    writer.padding = 5;
    writer.setFrame('TIT2', 'Home').setFrame('TPE1', ['Eminem']);
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      0,
      0,
      0,
      51, // tag size without header
      ...encodeWindows1252('TIT2'),
      0,
      0,
      0,
      11, // size of tit2 without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Home'),
      ...encodeWindows1252('TPE1'),
      0,
      0,
      0,
      15, // size of tpe1 without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Eminem'),
      0,
      0,
      0,
      0,
      0, // padding
      1,
      2,
      3, // payload
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Throw with wrong frame name', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('yoyo', 'hey');
    }, /Unsupported frame/);
  });
  it('Throw if no argument passed to constructor', () => {
    throws(() => {
      new ID3Writer();
    }, /First argument should be an instance of ArrayBuffer or Buffer/);
  });
});
