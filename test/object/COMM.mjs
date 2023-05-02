import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('COMM', () => {
  it('COMM', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('COMM', {
      description: 'advert',
      text: 'free hugs',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(50), // tag size without header
      ...encodeWindows1252('COMM'),
      ...uint32ToUint8Array(40), // frame size without header
      0,
      0, // flags
      1, // encoding
      ...encodeWindows1252('eng'),
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('advert'),
      0,
      0,
      0xff,
      0xfe, // separator, BOM
      ...encodeUtf16le('free hugs'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Change language', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('COMM', {
      language: 'jpn',
      description: 'この世界',
      text: '俺の名前',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(36), // tag size without header
      ...encodeWindows1252('COMM'),
      ...uint32ToUint8Array(26), // frame size without header
      0,
      0, // flags
      1, // encoding
      ...encodeWindows1252('jpn'),
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('この世界'),
      0,
      0, // separator
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('俺の名前'),
    ]);
    deepStrictEqual(actual, expected);
  });
});
