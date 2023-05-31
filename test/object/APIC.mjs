import { describe, it } from 'node:test';
import { deepStrictEqual, throws } from 'assert';
import { getEmptyBuffer, id3Header } from '../utils.mjs';
import { encodeUtf16le, encodeWindows1252 } from '../../src/encoder.mjs';
import {
  uint28ToUint7Array,
  uint32ToUint8Array,
} from '../../src/transform.mjs';
import { ID3Writer } from '../../dist/browser-id3-writer.mjs';

const imageContent = [4, 8, 15, 16, 23, 42];

describe('APIC', () => {
  it('jpeg', () => {
    const signature = [0xff, 0xd8, 0xff];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(35), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(25), // frame size without header
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
  it('jpeg with useUnicodeEncoding', () => {
    const signature = [0xff, 0xd8, 0xff];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
      useUnicodeEncoding: true,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(40), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(30), // frame size without header
      0,
      0, // flags
      1, // encoding
      ...encodeWindows1252('image/jpeg'),
      0, // separator
      3, // pic type
      0xff,
      0xfe, // BOM
      ...encodeUtf16le('yo'),
      0,
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('png', () => {
    const signature = [0x89, 0x50, 0x4e, 0x47];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(35), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(25), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/png'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('gif', () => {
    const signature = [0x47, 0x49, 0x46];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(34), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(24), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/gif'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('webp', () => {
    const signature = [0, 0, 0, 0, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(44), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(34), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/webp'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('tiff', () => {
    const signature = [0x49, 0x49, 0x2a, 0];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(36), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(26), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/tiff'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('tiff 2', () => {
    const signature = [0x4d, 0x4d, 0, 0x2a];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(36), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(26), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/tiff'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('bmp', () => {
    const signature = [0x42, 0x4d];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(33), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(23), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/bmp'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('icon', () => {
    const signature = [0, 0, 1, 0];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: 'yo',
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(38), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(28), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/x-icon'),
      0, // separator
      3, // pic type
      ...encodeWindows1252('yo'),
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Force Western encoding when description is empty', () => {
    const signature = [0, 0, 1, 0];
    const image = new Uint8Array(signature.concat(imageContent));
    const writer = new ID3Writer(getEmptyBuffer());
    writer.padding = 0;
    writer.setFrame('APIC', {
      type: 3,
      data: image.buffer,
      description: '',
      useUnicodeEncoding: true,
    });
    writer.addTag();
    const actual = new Uint8Array(writer.arrayBuffer);
    const expected = new Uint8Array([
      ...id3Header,
      ...uint28ToUint7Array(36), // tag size without header
      ...encodeWindows1252('APIC'),
      ...uint32ToUint8Array(26), // frame size without header
      0,
      0, // flags
      0, // encoding
      ...encodeWindows1252('image/x-icon'),
      0, // separator
      3, // pic type
      0, // separator
      ...signature,
      ...imageContent,
    ]);
    deepStrictEqual(actual, expected);
  });
  it('Throw when value is not an object', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('APIC', 4512);
    }, /APIC frame value should be an object with keys type, data and description/);
  });
  it('Throw when picture type is out of allowed range', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('APIC', {
        type: 43,
        data: new ArrayBuffer(20),
        description: '',
      });
    }, /Incorrect APIC frame picture type/);
  });
  it('Throw when mime type is not detected', () => {
    const writer = new ID3Writer(getEmptyBuffer());
    throws(() => {
      writer.setFrame('APIC', {
        type: 0,
        data: getEmptyBuffer(),
        description: '',
      });
    }, /Unknown picture MIME type/);
  });
});
