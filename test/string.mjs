import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from './utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../src/encoder.mjs';
import { uint28ToUint7Array, uint32ToUint8Array } from '../src/transform.mjs';
import { ID3Writer } from '../dist/browser-id3-writer.mjs';

const oneByteEncodedFrames = ['TDAT'];
const twoByteEncodedFrames = [
  'TLAN',
  'TIT1',
  'TIT2',
  'TIT3',
  'TALB',
  'TPE2',
  'TPE3',
  'TPE4',
  'TRCK',
  'TPOS',
  'TPUB',
  'TKEY',
  'TMED',
  'TSRC',
  'TCOP',
  'TEXT',
];
const urlLinkFrames = [
  'WCOM',
  'WCOP',
  'WOAF',
  'WOAR',
  'WOAS',
  'WORS',
  'WPAY',
  'WPUB',
];

describe('Frames: URL link', () => {
  urlLinkFrames.forEach((frameName) => {
    it(frameName, () => {
      const writer = new ID3Writer(getEmptyBuffer());
      writer.padding = 0;
      writer.setFrame(frameName, 'https://google.com');
      writer.addTag();
      const actual = new Uint8Array(writer.arrayBuffer);
      const expected = new Uint8Array([
        ...id3Header,
        ...uint28ToUint7Array(28), // tag size without header
        ...encodeWindows1252(frameName),
        ...uint32ToUint8Array(18), // frame size without header
        0,
        0, // flags
        ...encodeWindows1252('https://google.com'),
      ]);
      deepStrictEqual(actual, expected);
    });
  });
});

describe('Frames: one byte encoded string', () => {
  oneByteEncodedFrames.forEach((frameName) => {
    it(frameName, () => {
      const writer = new ID3Writer(getEmptyBuffer());
      writer.padding = 0;
      writer.setFrame(frameName, 'Lyricist/Text writer');
      writer.addTag();
      const actual = new Uint8Array(writer.arrayBuffer);
      const expected = new Uint8Array([
        ...id3Header,
        ...uint28ToUint7Array(31), // tag size without header
        ...encodeWindows1252(frameName),
        ...uint32ToUint8Array(21), // frame size without header
        0,
        0, // flags
        0, // encoding
        ...encodeWindows1252('Lyricist/Text writer'),
      ]);
      deepStrictEqual(actual, expected);
    });
  });
});

describe('Frames: two byte encoded string', () => {
  twoByteEncodedFrames.forEach((frameName) => {
    it(frameName, () => {
      const writer = new ID3Writer(getEmptyBuffer());
      writer.padding = 0;
      writer.setFrame(frameName, 'Lyricist/Text writer');
      writer.addTag();
      const actual = new Uint8Array(writer.arrayBuffer);
      const expected = new Uint8Array([
        ...id3Header,
        ...uint28ToUint7Array(53), // tag size without header
        ...encodeWindows1252(frameName),
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
});
