import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import { ID3Writer } from '../../dist/browser-id3-writer.mjs';

describe('IPLS', () => {
  it('IPLS', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('IPLS', [
      ['author', 'Thomas Bangalter'],
      ['author', 'Guy-Manuel de Homem-Christo'],
      ['mixer', 'DJ Falcon'],
    ]);
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(173), // tag size without header
      ...encodeWindows1252('IPLS'),
      ...uint32ToUint8Array(163), // frame size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('author'),
      0,
      0,
      0xff,
      0xfe, // separator, BOM
      ...encodeUtf16le('Thomas Bangalter'),
      0,
      0,
      0xff,
      0xfe, // separator, BOM
      ...encodeUtf16le('author'),
      0,
      0,
      0xff,
      0xfe, // separator, BOM
      ...encodeUtf16le('Guy-Manuel de Homem-Christo'),
      0,
      0,
      0xff,
      0xfe, // separator, BOM
      ...encodeUtf16le('mixer'),
      0,
      0,
      0xff,
      0xfe, // separator, BOM
      ...encodeUtf16le('DJ Falcon'),
      0,
      0, // separator (EOF)
    ]);
    deepStrictEqual(actual, expected);
  });
});
