import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('USLT', () => {
  it('USLT', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('USLT', {
      description: 'Ярл',
      lyrics: 'Лирика',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(38), // tag size without header
      ...encodeWindows1252('USLT'),
      ...uint32ToUint8Array(28), // frame size without header
      0,
      0, // flags
      1, // encoding
      ...encodeWindows1252('eng'),
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Ярл'),
      0,
      0, // separator
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Лирика'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Change language', () => {
    const writer = new ID3Writer(getEmptyBuffer());
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
      ...uint28ToUint7Array(38), // tag size without header
      ...encodeWindows1252('USLT'),
      ...uint32ToUint8Array(28), // frame size without header
      0,
      0, // flags
      1, // encoding
      ...encodeWindows1252('rus'),
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Ярл'),
      0,
      0, // separator
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Лирика'),
    ]);
    deepStrictEqual(actual, expected);
  });
});
