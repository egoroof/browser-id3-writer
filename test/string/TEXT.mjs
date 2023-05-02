import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('TEXT', () => {
  it('TEXT', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('TEXT', 'Lyricist/Text writer');
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(53), // tag size without header
      ...encodeWindows1252('TEXT'),
      ...uint32ToUint8Array(43), // frame size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Lyricist/Text writer'),
    ]);
    deepStrictEqual(actual, expected);
  });
});
