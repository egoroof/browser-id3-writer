import { describe, it } from 'node:test';
import { deepStrictEqual, throws } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('TPE1', () => {
  it('TPE1', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('TPE1', ['Eminem', '50 Cent']);
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(41), // tag size without header
      ...encodeWindows1252('TPE1'),
      ...uint32ToUint8Array(31), // frame size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Eminem/50 Cent'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Throw with wrong frame value', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('TPE1', 'hey');
    }, /TPE1 frame value should be an array of strings/);
  });
});
