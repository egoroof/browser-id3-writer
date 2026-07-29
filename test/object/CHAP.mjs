import { describe, it } from 'node:test';
import { deepStrictEqual, throws } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import { ID3Writer } from '../../dist/browser-id3-writer.mjs';

describe('CHAP', () => {
  it('Without sub frames', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CHAP', {
      id: 'chp0',
      startTime: 0,
      endTime: 3500,
      startOffset: 0,
      endOffset: 1024,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(31), // tag size without header
      ...encodeWindows1252('CHAP'),
      ...uint32ToUint8Array(21), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('chp0'),
      0, // separator
      ...uint32ToUint8Array(0), // start time
      ...uint32ToUint8Array(3500), // end time
      ...uint32ToUint8Array(0), // start offset
      ...uint32ToUint8Array(1024), // end offset
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Offsets default to being ignored when omitted', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CHAP', {
      id: 'chp0',
      startTime: 0,
      endTime: 3500,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(31), // tag size without header
      ...encodeWindows1252('CHAP'),
      ...uint32ToUint8Array(21), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('chp0'),
      0, // separator
      ...uint32ToUint8Array(0), // start time
      ...uint32ToUint8Array(3500), // end time
      0xff,
      0xff,
      0xff,
      0xff, // start offset ignored
      0xff,
      0xff,
      0xff,
      0xff, // end offset ignored
    ]);
    deepStrictEqual(actual, expected);
  });
  it('A zero offset is kept, not treated as missing', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CHAP', {
      id: 'chp0',
      startTime: 0,
      endTime: 3500,
      startOffset: 0,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(31), // tag size without header
      ...encodeWindows1252('CHAP'),
      ...uint32ToUint8Array(21), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('chp0'),
      0, // separator
      ...uint32ToUint8Array(0), // start time
      ...uint32ToUint8Array(3500), // end time
      ...uint32ToUint8Array(0), // start offset
      0xff,
      0xff,
      0xff,
      0xff, // end offset ignored
    ]);
    deepStrictEqual(actual, expected);
  });
  it('With a title sub frame', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CHAP', {
      id: 'chp0',
      startTime: 0,
      endTime: 3500,
      startOffset: 0,
      endOffset: 1024,
      subFrames: {
        TIT2: 'Intro',
      },
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(54), // tag size without header
      ...encodeWindows1252('CHAP'),
      ...uint32ToUint8Array(44), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('chp0'),
      0, // separator
      ...uint32ToUint8Array(0), // start time
      ...uint32ToUint8Array(3500), // end time
      ...uint32ToUint8Array(0), // start offset
      ...uint32ToUint8Array(1024), // end offset
      // TIT2 sub frame
      ...encodeWindows1252('TIT2'),
      ...uint32ToUint8Array(13), // sub frame size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Intro'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('With a url sub frame', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CHAP', {
      id: 'chp0',
      startTime: 0,
      endTime: 3500,
      startOffset: 0,
      endOffset: 1024,
      subFrames: {
        WXXX: {
          description: 'chapter url',
          value: 'https://google.com',
        },
      },
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(72), // tag size without header
      ...encodeWindows1252('CHAP'),
      ...uint32ToUint8Array(62), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('chp0'),
      0, // separator
      ...uint32ToUint8Array(0), // start time
      ...uint32ToUint8Array(3500), // end time
      ...uint32ToUint8Array(0), // start offset
      ...uint32ToUint8Array(1024), // end offset
      // WXXX sub frame
      ...encodeWindows1252('WXXX'),
      ...uint32ToUint8Array(31), // sub frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('chapter url'),
      0, // separator
      ...encodeWindows1252('https://google.com'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('With a picture sub frame', () => {
    const signature = [0xff, 0xd8, 0xff];
    const imageContent = [4, 8, 15, 16, 23, 42];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CHAP', {
      id: 'chp0',
      startTime: 0,
      endTime: 3500,
      startOffset: 0,
      endOffset: 1024,
      subFrames: {
        APIC: {
          type: 3,
          data: image.buffer,
          description: 'yo',
        },
      },
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(66), // tag size without header
      ...encodeWindows1252('CHAP'),
      ...uint32ToUint8Array(56), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('chp0'),
      0, // separator
      ...uint32ToUint8Array(0), // start time
      ...uint32ToUint8Array(3500), // end time
      ...uint32ToUint8Array(0), // start offset
      ...uint32ToUint8Array(1024), // end offset
      // APIC sub frame
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(25), // sub frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/jpeg'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Throw when value is not an object', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('CHAP', 'chp0');
    }, /CHAP frame value should be an object with keys id, startTime and endTime/);
  });
  it('Throw when a required key is missing', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('CHAP', {
        id: 'chp0',
        startTime: 0,
      });
    }, /CHAP frame value should be an object with keys id, startTime and endTime/);
  });
  it('Throw with an unsupported sub frame', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('CHAP', {
        id: 'chp0',
        startTime: 0,
        endTime: 3500,
        startOffset: 0,
        endOffset: 1024,
        subFrames: {
          TALB: 'Friday Night Lights',
        },
      });
    }, /Unsupported sub frame TALB/);
  });
});
