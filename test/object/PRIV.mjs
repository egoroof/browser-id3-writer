import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeWindows1252 } from '../../src/encoder.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('PRIV', () => {
  it('PRIV', () => {
    const data = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('PRIV', {
      id: 'site.com',
      data,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      0,
      0,
      0,
      28, // tag size without header
      ...encodeWindows1252('PRIV'),
      0,
      0,
      0,
      18, // size without header
      0,
      0, // flags
      ...encodeWindows1252('site.com'),
      0, // separator
      ...data,
    ]);
    deepStrictEqual(actual, expected);
  });
});
