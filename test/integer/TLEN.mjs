import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeWindows1252 } from '../../src/encoder.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('TLEN', () => {
  it('TLEN', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('TLEN', 7200000);
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      0,
      0,
      0,
      18, // tag size without header
      ...encodeWindows1252('TLEN'),
      0,
      0,
      0,
      8, // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('7200000'),
    ]);
    deepStrictEqual(actual, expected);
  });
});
