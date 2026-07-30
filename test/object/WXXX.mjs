import { describe, it } from 'node:test';
import { deepStrictEqual, throws } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import { ID3Writer } from '../../dist/browser-id3-writer.mjs';

describe('WXXX', () => {
  it('WXXX', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('WXXX', {
      description: 'foo',
      value: 'https://google.com',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(33), // tag size without header
      ...encodeWindows1252('WXXX'),
      ...uint32ToUint8Array(23), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('foo'),
      0, // separator
      ...encodeWindows1252('https://google.com'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('WXXX with useUnicodeEncoding', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('WXXX', {
      description: 'Ярл',
      value: 'https://google.com',
      useUnicodeEncoding: true,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(39), // tag size without header
      ...encodeWindows1252('WXXX'),
      ...uint32ToUint8Array(29), // frame size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('Ярл'),
      0,
      0, // separator
      ...encodeWindows1252('https://google.com'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Force Western encoding when description is empty', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('WXXX', {
      description: '',
      value: 'https://google.com',
      useUnicodeEncoding: true,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(30), // tag size without header
      ...encodeWindows1252('WXXX'),
      ...uint32ToUint8Array(20), // frame size without header
      0,
      0, // flags
      0, // encoding
      0, // separator
      ...encodeWindows1252('https://google.com'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Throw with simple string', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('WXXX', 'https://google.com');
    }, /WXXX frame value should be an object with keys description and value/);
  });
  it('Throw when no description provided', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('WXXX', {
        value: 'https://google.com',
      });
    }, /WXXX frame value should be an object with keys description and value/);
  });
  it('Throw when no value provided', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('WXXX', {
        description: 'foo',
      });
    }, /WXXX frame value should be an object with keys description and value/);
  });
});
