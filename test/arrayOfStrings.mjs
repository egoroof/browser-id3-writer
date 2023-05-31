import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import { getEmptyBuffer, id3Header } from './utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../src/encoder.mjs';
import { uint28ToUint7Array, uint32ToUint8Array } from '../src/transform.mjs';
import { ID3Writer } from '../dist/browser-id3-writer.mjs';

const frames = ['TPE1', 'TCOM', 'TCON'];

describe('Frames: array of strings', () => {
  frames.forEach((frameName) => {
    it(frameName, () => {
      const delemiter = frameName === 'TCON' ? ';' : '/';
      const writer = new ID3Writer(getEmptyBuffer());
      writer.padding = 0;
      writer.setFrame(frameName, ['Eminem', '50 Cent']);
      writer.addTag();
      const actual = new Uint8Array(writer.arrayBuffer);
      const expected = new Uint8Array([
        ...id3Header,
        ...uint28ToUint7Array(41), // tag size without header
        ...encodeWindows1252(frameName),
        ...uint32ToUint8Array(31), // frame size without header
        0,
        0, // flags
        1, // encoding
        0xff,
        0xfe, // BOM
        ...encodeUtf16le(`Eminem${delemiter}50 Cent`),
      ]);
      deepStrictEqual(actual, expected);
    });
  });
});
