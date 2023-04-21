import { describe, it } from 'node:test';
import { deepStrictEqual } from 'assert';
import {
  uint32ToUint8Array,
  uint28ToUint7Array,
  uint7ArrayToUint28,
} from '../src/transform.mjs';

describe('transform', () => {
  describe('uint32ToUint8Array', () => {
    it('255 - only first byte', () => {
      const actual = uint32ToUint8Array(255);
      const expected = [0, 0, 0, 255];
      deepStrictEqual(actual, expected);
    });
    it('256 - second byte', () => {
      const actual = uint32ToUint8Array(256);
      const expected = [0, 0, 1, 0];
      deepStrictEqual(actual, expected);
    });
    it('257 - second + first bytes', () => {
      const actual = uint32ToUint8Array(257);
      const expected = [0, 0, 1, 1];
      deepStrictEqual(actual, expected);
    });
    it('2 ** 16', () => {
      const actual = uint32ToUint8Array(2 ** 16);
      const expected = [0, 1, 0, 0];
      deepStrictEqual(actual, expected);
    });
    it('2 ** 24', () => {
      const actual = uint32ToUint8Array(2 ** 24);
      const expected = [1, 0, 0, 0];
      deepStrictEqual(actual, expected);
    });
    it('max (2**32)-1', () => {
      const actual = uint32ToUint8Array(2 ** 32 - 1);
      const expected = [255, 255, 255, 255];
      deepStrictEqual(actual, expected);
    });
    it('overflow on 2**32', () => {
      const actual = uint32ToUint8Array(2 ** 32);
      const expected = [0, 0, 0, 0];
      deepStrictEqual(actual, expected);
    });
  });

  describe('uint28ToUint7Array', () => {
    it('127 - only first byte', () => {
      const actual = uint28ToUint7Array(127);
      const expected = [0, 0, 0, 127];
      deepStrictEqual(actual, expected);
    });
    it('128 - second byte', () => {
      const actual = uint28ToUint7Array(128);
      const expected = [0, 0, 1, 0];
      deepStrictEqual(actual, expected);
    });
    it('129 - second + first bytes', () => {
      const actual = uint28ToUint7Array(129);
      const expected = [0, 0, 1, 1];
      deepStrictEqual(actual, expected);
    });
    it('2**14', () => {
      const actual = uint28ToUint7Array(2 ** 14);
      const expected = [0, 1, 0, 0];
      deepStrictEqual(actual, expected);
    });
    it('2**21', () => {
      const actual = uint28ToUint7Array(2 ** 21);
      const expected = [1, 0, 0, 0];
      deepStrictEqual(actual, expected);
    });
    it('max (2**28)-1', () => {
      const actual = uint28ToUint7Array(2 ** 28 - 1);
      const expected = [127, 127, 127, 127];
      deepStrictEqual(actual, expected);
    });
    it('overflow on 2**28', () => {
      const actual = uint28ToUint7Array(2 ** 28);
      const expected = [0, 0, 0, 0];
      deepStrictEqual(actual, expected);
    });
  });

  describe('uint7ArrayToUint28', () => {
    it('127', () => {
      const actual = uint7ArrayToUint28([0, 0, 0, 127]);
      const expected = 127;
      deepStrictEqual(actual, expected);
    });
    it('128', () => {
      const actual = uint7ArrayToUint28([0, 0, 1, 0]);
      const expected = 128;
      deepStrictEqual(actual, expected);
    });
    it('129', () => {
      const actual = uint7ArrayToUint28([0, 0, 1, 1]);
      const expected = 129;
      deepStrictEqual(actual, expected);
    });
    it('2 ** 14', () => {
      const actual = uint7ArrayToUint28([0, 1, 0, 0]);
      const expected = 2 ** 14;
      deepStrictEqual(actual, expected);
    });
    it('2 ** 21', () => {
      const actual = uint7ArrayToUint28([1, 0, 0, 0]);
      const expected = 2 ** 21;
      deepStrictEqual(actual, expected);
    });
    it('max (2**28)-1', () => {
      const actual = uint7ArrayToUint28([127, 127, 127, 127]);
      const expected = 2 ** 28 - 1;
      deepStrictEqual(actual, expected);
    });
  });
});
