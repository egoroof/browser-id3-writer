import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('TIT2', () => {
  it('TIT2', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('TIT2', 'Forge');
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      0,
      0,
      0,
      23, // tag size without header
      ...encodeWindows1252('TIT2'),
      0,
      0,
      0,
      13, // frame size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Forge'),
    ]);
    deepStrictEqual(actual, expected);
  });
});
