import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeWindows1252, encodeUtf16le } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import { ID3Writer } from '../../dist/browser-id3-writer.mjs';

describe('SYLT', () => {
  it('SYLT', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('SYLT', {
      text: [
        ["She's up all night 'til the sun", 1],
        ["I'm up all night to get some", 2],
        ["She's up all night for good fun", 3],
        ["I'm up all night to get lucky", 4],
      ],
      type: 1,
      timestampFormat: 2,
      language: 'eng',
      description: 'Description',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(312), // tag size without header
      ...encodeWindows1252('SYLT'),
      ...uint32ToUint8Array(302), // frame size without header
      0,
      0, // flags
      1, // text encoding
      ...encodeWindows1252('eng'), // language
      2, // Time stamp format
      1, // Content type
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Description'), // description
      0,
      0, // separator
      0xff,
      0xfe, // BOM
      ...encodeUtf16le("She's up all night 'til the sun"),
      0,
      0, // separator
      0,
      0,
      0,
      1, // timestamp
      0xff,
      0xfe, // BOM
      ...encodeUtf16le("I'm up all night to get some"),
      0,
      0, // separator
      0,
      0,
      0,
      2, // timestamp
      0xff,
      0xfe, // BOM
      ...encodeUtf16le("She's up all night for good fun"),
      0,
      0, // separator
      0,
      0,
      0,
      3, // timestamp
      0xff,
      0xfe, // BOM
      ...encodeUtf16le("I'm up all night to get lucky"),
      0,
      0, // separator
      0,
      0,
      0,
      4, // timestamp
    ]);
    deepStrictEqual(actual, expected);
  });
});
