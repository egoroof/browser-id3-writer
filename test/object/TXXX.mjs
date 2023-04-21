import { describe, it } from 'node:test';
import { deepStrictEqual, throws } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import ID3Writer from '../../dist/browser-id3-writer.js';

describe('TXXX', () => {
  it('TXXX', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('TXXX', {
      description: 'foo',
      value: 'bar',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      0,
      0,
      0,
      29, // tag size without header
      ...encodeWindows1252('TXXX'),
      0,
      0,
      0,
      19, // size without header
      0,
      0, // flags
      1, // encoding
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('foo'),
      0,
      0, // separator
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('bar'),
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Throw with simple string', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('TXXX', 'foobar');
    }, /TXXX frame value should be an object with keys description and value/);
  });
  it('Throw when no description provided', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('TXXX', {
        value: 'foobar',
      });
    }, /TXXX frame value should be an object with keys description and value/);
  });
  it('Throw when no value provided', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('TXXX', {
        description: 'foobar',
      });
    }, /TXXX frame value should be an object with keys description and value/);
  });
});
