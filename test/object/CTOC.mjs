import { describe, it } from 'node:test';
import { deepStrictEqual, throws } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import { ID3Writer } from '../../dist/browser-id3-writer.mjs';

describe('CTOC', () => {
  it('Without sub frames', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CTOC', {
      id: 'toc0',
      ordered: true,
      topLevel: true,
      childElementIds: ['chp0', 'chp1'],
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(27), // tag size without header
      ...encodeWindows1252('CTOC'),
      ...uint32ToUint8Array(17), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('toc0'),
      0, // separator
      3, // top level + ordered
      2, // entry count
      ...encodeWindows1252('chp0'),
      0, // separator
      ...encodeWindows1252('chp1'),
      0, // separator
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Neither top level nor ordered', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CTOC', {
      id: 'toc0',
      childElementIds: ['chp0', 'chp1'],
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(27), // tag size without header
      ...encodeWindows1252('CTOC'),
      ...uint32ToUint8Array(17), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('toc0'),
      0, // separator
      0, // neither top level nor ordered
      2, // entry count
      ...encodeWindows1252('chp0'),
      0, // separator
      ...encodeWindows1252('chp1'),
      0, // separator
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Top level but not ordered', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CTOC', {
      id: 'toc0',
      topLevel: true,
      childElementIds: ['chp0'],
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(22), // tag size without header
      ...encodeWindows1252('CTOC'),
      ...uint32ToUint8Array(12), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('toc0'),
      0, // separator
      2, // top level
      1, // entry count
      ...encodeWindows1252('chp0'),
      0, // separator
    ]);
    deepStrictEqual(actual, expected);
  });
  it('With a title sub frame', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('CTOC', {
      id: 'toc0',
      ordered: true,
      topLevel: true,
      childElementIds: ['chp0', 'chp1'],
      subFrames: {
        TIT2: 'Podcast',
      },
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(54), // tag size without header
      ...encodeWindows1252('CTOC'),
      ...uint32ToUint8Array(44), // frame size without header
      0,
      0, // flags
      ...encodeWindows1252('toc0'),
      0, // separator
      3, // top level + ordered
      2, // entry count
      ...encodeWindows1252('chp0'),
      0, // separator
      ...encodeWindows1252('chp1'),
      0, // separator
      // TIT2 sub frame
      ...encodeWindows1252('TIT2'),
      ...uint32ToUint8Array(17), // sub frame size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Podcast'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Throw when value is not an object', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('CTOC', 'toc0');
    }, /CTOC frame value should be an object with keys id and childElementIds/);
  });
  it('Throw when childElementIds is not an array', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('CTOC', {
        id: 'toc0',
        childElementIds: 'chp0',
      });
    }, /CTOC frame childElementIds should be an array/);
  });
  it('Throw with more than 255 entries', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('CTOC', {
        id: 'toc0',
        childElementIds: Array.from({ length: 256 }, (_, i) => `chp${i}`),
      });
    }, /CTOC frame can not have more than 255 entries/);
  });
});
