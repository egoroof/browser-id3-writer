const assert = require('assert');
const ID3Writer = require('../../dist/browser-id3-writer.min');

const emptyBuffer = new ArrayBuffer(0);
const imageContent = [4, 8, 15, 16, 23, 42];
const id3Header = [
    73, 68, 51, // ID3 magic nubmer
    3, 0, // version
    0, // flags
];
const apicHeader = [
    65, 80, 73, 67, // 'APIC'
];

describe('APIC', () => {
    it('jpeg', () => {
        const signature = [0xff, 0xd8, 0xff];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 35, // tag size without header
            ...apicHeader,
            0, 0, 0, 25, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 106, 112, 101, 103, // mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('jpeg with useUnicodeEncoding', () => {
        const signature = [0xff, 0xd8, 0xff];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 40, // tag size without header
            ...apicHeader,
            0, 0, 0, 30, // size without header
            0, 0, // flags
            1, // encoding
            105, 109, 97, 103, 101, 47, 106, 112, 101, 103, // mime
            0, 3, 255, 254, // separator, pic type, bom
            121, 0, 111, 0, // description
            0, 0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('png', () => {
        const signature = [0x89, 0x50, 0x4e, 0x47];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 35, // tag size without header
            ...apicHeader,
            0, 0, 0, 25, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 112, 110, 103,// mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('gif', () => {
        const signature = [0x47, 0x49, 0x46];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 34, // tag size without header
            ...apicHeader,
            0, 0, 0, 24, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 103, 105, 102, // mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('webp', () => {
        const signature = [0, 0, 0, 0, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 44, // tag size without header
            ...apicHeader,
            0, 0, 0, 34, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 119, 101, 98, 112, // mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('tiff', () => {
        const signature = [0x49, 0x49, 0x2a, 0];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 36, // tag size without header
            ...apicHeader,
            0, 0, 0, 26, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 116, 105, 102, 102, // mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('tiff 2', () => {
        const signature = [0x4d, 0x4d, 0, 0x2a];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 36, // tag size without header
            ...apicHeader,
            0, 0, 0, 26, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 116, 105, 102, 102, // mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('bmp', () => {
        const signature = [0x42, 0x4d];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 33, // tag size without header
            ...apicHeader,
            0, 0, 0, 23, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 98, 109, 112, // mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('icon', () => {
        const signature = [0, 0, 1, 0];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 38, // tag size without header
            ...apicHeader,
            0, 0, 0, 28, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 120, 45, 105, 99, 111, 110, // mime
            0, 3, // separator, pic type
            121, 111, // description
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('Force Western encoding when description is empty', () => {
        const signature = [0, 0, 1, 0];
        const image = new Uint8Array(signature.concat(imageContent));
        const writer = new ID3Writer(emptyBuffer);
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
            0, 0, 0, 36, // tag size without header
            ...apicHeader,
            0, 0, 0, 26, // size without header
            0, 0, // flags
            0, // encoding
            105, 109, 97, 103, 101, 47, 120, 45, 105, 99, 111, 110, // mime
            0, 3, // separator, pic type
            0, // separator
            ...signature,
            ...imageContent,
        ]);
        assert.deepStrictEqual(actual, expected);
    });
    it('Throw when value is not an object', () => {
        const writer = new ID3Writer(emptyBuffer);
        assert.throws(() => {
            writer.setFrame('APIC', 4512);
        }, /APIC frame value should be an object with keys type, data and description/);
    });
    it('Throw when picture type is out of allowed range', () => {
        const writer = new ID3Writer(emptyBuffer);
        assert.throws(() => {
            writer.setFrame('APIC', {
                type: 43,
                data: new ArrayBuffer(20),
                description: '',
            });
        }, /Incorrect APIC frame picture type/);
    });
    it('Throw when mime type is not detected', () => {
        const writer = new ID3Writer(emptyBuffer);
        assert.throws(() => {
            writer.setFrame('APIC', {
                type: 0,
                data: emptyBuffer,
                description: '',
            });
        }, /Unknown picture MIME type/);
    });
});
