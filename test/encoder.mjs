import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import {
  strToCodePoints,
  encodeWindows1252,
  encodeUtf16le,
} from '../src/encoder.mjs';

describe('encoder', () => {
  describe('strToCodePoints', () => {
    it('latin', () => {
      const actual = strToCodePoints('Hello');
      const expected = [72, 101, 108, 108, 111];
      deepStrictEqual(actual, expected);
    });
    it('cyrillic', () => {
      const actual = strToCodePoints('Привет');
      const expected = [1055, 1088, 1080, 1074, 1077, 1090];
      deepStrictEqual(actual, expected);
    });
  });

  describe('encodeWindows1252', () => {
    it('encodes latin', () => {
      const actual = encodeWindows1252('Hello');
      const expected = new Uint8Array([72, 101, 108, 108, 111]);
      deepStrictEqual(actual, expected);
    });
    it('loses cyrillic', () => {
      const actual = encodeWindows1252('Привет');
      const expected = new Uint8Array([31, 64, 56, 50, 53, 66]);
      deepStrictEqual(actual, expected);
    });
  });

  describe('encodeUtf16le', () => {
    it('encodes latin', () => {
      const actual = encodeUtf16le('Hello');
      const expected = new Uint8Array([72, 0, 101, 0, 108, 0, 108, 0, 111, 0]);
      deepStrictEqual(actual, expected);
    });
    it('encodes cyrillic', () => {
      const actual = encodeUtf16le('Привет');
      const expected = new Uint8Array([
        31, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4,
      ]);
      deepStrictEqual(actual, expected);
    });
  });
});
