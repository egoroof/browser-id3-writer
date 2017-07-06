function encodeWindows1252(str) {
    return String(str).split('').map(function (c) {
        return c.charCodeAt(0);
    });
}

function getMp3fileSurrogate() {
    const buffer = new ArrayBuffer(10);
    const uint8 = new Uint8Array(buffer);

    uint8.set([0xff, 0xfb, 0, 1, 2, 3, 4, 5, 6, 7]);

    return buffer;
}

function getMp3fileSurrogateWithId3() {
    const buffer = new ArrayBuffer(10);
    const uint8 = new Uint8Array(buffer);

    uint8.set([0x49, 0x44, 0x33, 0, 1, 2, 3, 4, 5, 6]);

    return buffer;
}

const files = {
    mp3: getMp3fileSurrogate(),
    mp3WithId3: getMp3fileSurrogateWithId3()
};

const tests = [{
    describe: 'constructor',
    it: [{
        describe: 'should be possible to create an instance',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            const writer2 = new ID3Writer(files.mp3WithId3);

            expect(writer).to.be.instanceof(ID3Writer);
            expect(writer2).to.be.instanceof(ID3Writer);
        }
    }, {
        describe: 'should throw an exception if no argument passed to constructor',
        test: function (ID3Writer, expect) {
            expect(function () {
                new ID3Writer();
            }).to.throw(Error, 'First argument should be an instance of ArrayBuffer or Buffer');
        }
    }]
}, {
    describe: 'invalid usage',
    it: [{
        describe: 'should throw an exception with wrong frame name',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('wrongFrameName', 'val');
            }).to.throw(Error, 'Unsupported frame');
        }
    }]
}, {
    describe: 'integer frames',
    it: [{
        describe: 'should correctly set TLEN frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('TLEN', 7200000);

            const buffer = writer.addTag();
            const frameTotalSize = 18;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                84, 76, 69, 78, // 'TLEN'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                0, // encoding
                55, 50, 48, 48, 48, 48, 48 // frame value - 7200000
            ]));
        }
    }, {
        describe: 'should correctly set TYER frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('TYER', 2011);

            const buffer = writer.addTag();
            const frameTotalSize = 15;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                84, 89, 69, 82, // 'TYER'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                0, // encoding
                50, 48, 49, 49 // 2011
            ]));
        }
    }]
}, {
    describe: 'array of strings frames',
    it: [{
        describe: 'should correctly set TPE1 frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('TPE1', ['Eminem', '50 Cent']);

            const buffer = writer.addTag();
            const frameTotalSize = 41;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                84, 80, 69, 49, // 'TPE1'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                1, 0xff, 0xfe, // encoding, BOM
                69, 0, 109, 0, 105, 0, 110, 0, 101, 0, 109, 0, 47, 0, // Eminem/
                53, 0, 48, 0, 32, 0, 67, 0, 101, 0, 110, 0, 116, 0 // 50 Cent
            ]));
        }
    }, {
        describe: 'should throw an exception with wrong frame value',
        test: function (ID3Writer, expect) {
            const frames = ['TPE1', 'TCOM', 'TCON'];
            const writer = new ID3Writer(files.mp3);

            frames.forEach(function (frameName) {
                expect(function () {
                    writer.setFrame(frameName, '');
                }).to.throw(Error, 'frame value should be an array of strings');
            });
        }
    }]
}, {
    describe: 'string frames',
    it: [{
        describe: 'should correctly set TIT2 frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('TIT2', 'Емеля - forge');

            const buffer = writer.addTag();
            const frameTotalSize = 39;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                84, 73, 84, 50, // 'TIT2'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                1, 0xff, 0xfe, // encoding, BOM
                21, 4, 60, 4, 53, 4, 59, 4, 79, 4, 32, 0, 45, 0, 32, 0, // Емеля -
                102, 0, 111, 0, 114, 0, 103, 0, 101, 0 // forge
            ]));
        }
    }, {
        describe: 'should correctly set WPAY frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('WPAY', 'https://google.com');

            const buffer = writer.addTag();
            const frameTotalSize = 28;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                87, 80, 65, 89, // 'WPAY'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                104, 116, 116, 112, 115, 58, 47, 47, 103, 111, 111, 103, 108, 101, 46, 99, 111, 109 // 'https://google.com'
            ]));
        }
    }, {
        describe: 'should throw an exception with wrong value for TKEY frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            expect(function () {
                writer.setFrame('TKEY', 'C minor');
            }).to.throw(Error, 'TKEY frame value should be like Dbm, C#, B or o');
        }
    }]
}, {
    describe: 'object frames',
    it: [{
        describe: 'should correctly set COMM frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('COMM', {
                description: 'advert',
                text: 'free hugs'
            });

            const buffer = writer.addTag();
            const frameTotalSize = 50;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                67, 79, 77, 77, // 'COMM'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                1, 101, 110, 103, 0xff, 0xfe, // encoding, language, BOM
                97, 0, 100, 0, 118, 0, 101, 0, 114, 0, 116, 0, // 'advert'
                0, 0, 0xff, 0xfe, // separator, BOM
                102, 0, 114, 0, 101, 0, 101, 0, 32, 0, 104, 0, 117, 0, 103, 0, 115, 0 // 'free hugs'
            ]));
        }
    }, {
        describe: 'should correctly set TXXX frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('TXXX', {
                description: 'foo',
                value: 'bar'
            });

            const buffer = writer.addTag();
            const frameTotalSize = 29;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                84, 88, 88, 88, // 'TXXX'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                1, 0xff, 0xfe, // encoding, BOM
                102, 0, 111, 0, 111, 0, // 'foo'
                0, 0, 0xff, 0xfe, // separator, BOM
                98, 0, 97, 0, 114, 0 // 'bar'
            ]));
        }
    }, {
        describe: 'should correctly set USLT frame',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);
            writer.setFrame('USLT', {
                description: 'Ярл',
                lyrics: 'Лирика'
            });

            const buffer = writer.addTag();
            const frameTotalSize = 38;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                85, 83, 76, 84, // 'USLT'
                0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                0, 0, // flags
                1, // encoding
                101, 110, 103, // language
                0xff, 0xfe, // BOM
                47, 4, 64, 4, 59, 4, // 'Ярл'
                0, 0, 0xff, 0xfe, // separator, BOM
                27, 4, 56, 4, 64, 4, 56, 4, 58, 4, 48, 4 // 'Лирика'
            ]));
        }
    }]
}, {
    describe: 'TXXX',
    it: [{
        describe: 'should throw an exception when used with simple string',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('TXXX', 'foobar');
            }).to.throw(Error, 'TXXX frame value should be an object with keys description and value');
        }
    }, {
        describe: 'should throw an exception when no description provided',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('TXXX', {
                    value: 'foobar'
                });
            }).to.throw(Error, 'TXXX frame value should be an object with keys description and value');
        }
    }, {
        describe: 'should throw an exception when no value provided',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('TXXX', {
                    description: 'foobar'
                });
            }).to.throw(Error, 'TXXX frame value should be an object with keys description and value');
        }
    }]
}, {
    describe: 'APIC',
    it: [{
        describe: 'should throw an error when value is not an object',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('APIC', 4512);
            }).to.throw(Error, 'APIC frame value should be an object with keys type, data and description');
        }
    }, {
        describe: 'should throw an error when picture type is out of allowed range',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('APIC', {
                    type: 42,
                    data: new ArrayBuffer(20),
                    description: ''
                });
            }).to.throw(Error, 'Incorrect APIC frame picture type');
        }
    }, {
        describe: 'should throw an error when mime type is not detected',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('APIC', {
                    type: 0,
                    data: new ArrayBuffer(20),
                    description: ''
                });
            }).to.throw(Error, 'Unknown picture MIME type');
        }
    }, {
        describe: 'should throw an error when buffer is empty',
        test: function (ID3Writer, expect) {
            const writer = new ID3Writer(files.mp3);

            expect(function () {
                writer.setFrame('APIC', {
                    type: 0,
                    data: new ArrayBuffer(0),
                    description: ''
                });
            }).to.throw(Error, 'Unknown picture MIME type');
        }
    }, {
        describe: 'should not use Unicode encoding by default',
        test: function (ID3Writer, expect) {
            const type = {
                signature: [0xff, 0xd8, 0xff],
                mime: 'image/jpeg'
            };
            const content = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const coverBuffer = new ArrayBuffer(type.signature.length + content.length);
            const coverUint8 = new Uint8Array(coverBuffer);
            coverUint8.set(type.signature);
            coverUint8.set(content, type.signature.length);

            const writer = new ID3Writer(files.mp3);

            writer.setFrame('APIC', {
                type: 3,
                data: coverBuffer,
                description: 'Pic'
            });

            const buffer = writer.addTag();
            const frameTotalSize = type.mime.length + type.signature.length + content.length + 17;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                    65, 80, 73, 67, // 'APIC'
                    0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                    0, 0, // flags
                    0 // encoding
                ].concat(encodeWindows1252(type.mime))
                    .concat([0, 3]) // delemiter, pic type
                    .concat([0x50, 0x69, 0x63]) // 'Pic'
                    .concat([0]) // separator
                    .concat(type.signature)
                    .concat(content)
            ));
        }
    }, {
        describe: 'should force Western encoding when description is empty',
        test: function (ID3Writer, expect) {
            const type = {
                signature: [0xff, 0xd8, 0xff],
                mime: 'image/jpeg'
            };
            const content = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const coverBuffer = new ArrayBuffer(type.signature.length + content.length);
            const coverUint8 = new Uint8Array(coverBuffer);
            coverUint8.set(type.signature);
            coverUint8.set(content, type.signature.length);

            const writer = new ID3Writer(files.mp3);

            writer.setFrame('APIC', {
                type: 3,
                data: coverBuffer,
                description: '',
                useUnicodeEncoding: true
            });

            const buffer = writer.addTag();
            const frameTotalSize = type.mime.length + type.signature.length + content.length + 14;
            const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

            expect(bufferUint8).to.eql(new Uint8Array([
                    65, 80, 73, 67, // 'APIC'
                    0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                    0, 0, // flags
                    0 // encoding
                ].concat(encodeWindows1252(type.mime))
                    .concat([0, 3]) // delemiter, pic type
                    .concat([0]) // separator
                    .concat(type.signature)
                    .concat(content)
            ));
        }
    }, {
        describe: 'should accept various image types',
        test: function (ID3Writer, expect) {
            const types = [{
                signature: [0xff, 0xd8, 0xff],
                mime: 'image/jpeg'
            }, {
                signature: [0x89, 0x50, 0x4e, 0x47],
                mime: 'image/png'
            }, {
                signature: [0x47, 0x49, 0x46],
                mime: 'image/gif'
            }, {
                signature: [0, 0, 0, 0, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
                mime: 'image/webp'
            }, {
                signature: [0x49, 0x49, 0x2a, 0],
                mime: 'image/tiff'
            }, {
                signature: [0x4d, 0x4d, 0, 0x2a],
                mime: 'image/tiff'
            }, {
                signature: [0x42, 0x4d],
                mime: 'image/bmp'
            }, {
                signature: [0, 0, 1, 0],
                mime: 'image/x-icon'
            }];
            const content = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

            types.forEach(function (type) {
                const coverBuffer = new ArrayBuffer(type.signature.length + content.length);
                const coverUint8 = new Uint8Array(coverBuffer);

                coverUint8.set(type.signature);
                coverUint8.set(content, type.signature.length);

                const writer = new ID3Writer(files.mp3);

                writer.setFrame('APIC', {
                    type: 3,
                    data: coverBuffer,
                    description: 'Картина',
                    useUnicodeEncoding: true
                });

                const buffer = writer.addTag();
                const frameTotalSize = type.mime.length + type.signature.length + content.length + 31;
                const bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

                expect(bufferUint8).to.eql(new Uint8Array([
                        65, 80, 73, 67, // 'APIC'
                        0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                        0, 0, // flags
                        1 // encoding
                    ].concat(encodeWindows1252(type.mime))
                        .concat([0, 3, 0xff, 0xfe]) // delemiter, pic type, BOM
                        .concat([26, 4, 48, 4, 64, 4, 66, 4, 56, 4, 61, 4, 48, 4]) // 'Картина'
                        .concat([0, 0]) // separator
                        .concat(type.signature)
                        .concat(content)
                ));
            });
        }
    }]
}];

if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = tests;
} else {
    this['tests'] = tests;
}
