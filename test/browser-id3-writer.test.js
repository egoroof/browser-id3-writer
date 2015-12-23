var assetsPath = '/base/test/assets/';

function ajax(url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
        } else {
            onError(new Error(xhr.statusText + ' (' + xhr.status + ')'));
        }
    };
    xhr.onerror = function () {
        onError(new Error('Network error'));
    };
    xhr.send();
}

describe('ID3Writer', function () {

    it('should be possible to create an instance', function () {
        var buffer = new ArrayBuffer(0);
        var writer = new ID3Writer(buffer);
        expect(writer).to.be.instanceof(ID3Writer);
    });

    it('should throw an exception if no argument passed to constructor', function () {
        expect(function () {
            var writer = new ID3Writer();
        }).to.throw(Error, 'First argument should be an instance of ArrayBuffer');
    });

    it('should change byte count', function (done) {
        var songByteCount = 1141027;
        var songWithTagByteCount = 1145201;
        ajax(assetsPath + 'the_decant_session.mp3', function (arrayBuffer) {
            expect(arrayBuffer.byteLength).to.be.equal(songByteCount);
            var writer = new ID3Writer(arrayBuffer);
            writer.setFrame('TIT2', 'song name')
                .setFrame('TPE1', ['song artists']);
            var arrayBufferWithTag = writer.addTag();
            expect(arrayBufferWithTag.byteLength).to.be.equal(songWithTagByteCount);
            done();
        });
    });

    it('wrong frame value type should throw an exception', function () {
        var frames = ['TPE1', 'TCOM', 'TCON'];
        var buffer = new ArrayBuffer(0);
        var writer = new ID3Writer(buffer);
        frames.forEach(function (frameName) {
            expect(function () {
                writer.setFrame(frameName, '');
            }).to.throw(Error, 'frame value should be an array of strings');
            expect(writer.setFrame(frameName, [])).to.be.instanceof(ID3Writer);
        });
    });

    it('set incorrect frame name should throw an exception', function () {
        var buffer = new ArrayBuffer(0);
        var writer = new ID3Writer(buffer);
        expect(function () {
            writer.setFrame('wrongFrameName', 'val');
        }).to.throw(Error, 'Unsupported frame');
    });

    describe('APIC', function () {

        it('should throw error when mime type is not detected', function () {
            var writer = new ID3Writer(new ArrayBuffer(0));
            expect(function () {
                writer.setFrame('APIC', new ArrayBuffer(20));
            }).to.throw(Error, 'Unknown picture MIME type');
        });

        it('should throw error when buffer is empty', function () {
            var writer = new ID3Writer(new ArrayBuffer(0));
            expect(function () {
                writer.setFrame('APIC', new ArrayBuffer(0));
            }).to.throw(Error, 'Unknown picture MIME type');
        });

        it('should accept various image types', function () {
            var types = [
                { // jpeg
                    signature: [0xff, 0xd8, 0xff],
                    mime: [105, 109, 97, 103, 101, 47, 106, 112, 101, 103]
                },
                { // png
                    signature: [0x89, 0x50, 0x4e, 0x47],
                    mime: [105, 109, 97, 103, 101, 47, 112, 110, 103]
                },
                { // gif
                    signature: [0x47, 0x49, 0x46],
                    mime: [105, 109, 97, 103, 101, 47, 103, 105, 102]
                },
                { // webp
                    signature: [0, 0, 0, 0, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
                    mime: [105, 109, 97, 103, 101, 47, 119, 101, 98, 112]
                },
                { // tiff LE
                    signature: [0x49, 0x49, 0x2a, 0],
                    mime: [105, 109, 97, 103, 101, 47, 116, 105, 102, 102]
                },
                { // tiff BE
                    signature: [0x4d, 0x4d, 0, 0x2a],
                    mime: [105, 109, 97, 103, 101, 47, 116, 105, 102, 102]
                },
                { // bmp
                    signature: [0x42, 0x4d],
                    mime: [105, 109, 97, 103, 101, 47, 98, 109, 112]
                },
                { // ico
                    signature: [0, 0, 1, 0],
                    mime: [105, 109, 97, 103, 101, 47, 120, 45, 105, 99, 111, 110]
                }
            ];

            var content = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            types.forEach(function (type) {
                var coverBuffer = new ArrayBuffer(type.signature.length + content.length);
                var coverUint8 = new Uint8Array(coverBuffer);
                coverUint8.set(type.signature);
                coverUint8.set(content, type.signature.length);

                var writer = new ID3Writer(new ArrayBuffer(0));
                writer.setFrame('APIC', coverBuffer);
                var buffer = writer.addTag();
                var frameTotalSize = type.mime.length + type.signature.length + content.length + 14;
                var bufferUint8 = new Uint8Array(buffer, 10, frameTotalSize);

                expect(bufferUint8).to.eql(new Uint8Array([
                        65, 80, 73, 67, // 'APIC'
                        0, 0, 0, frameTotalSize - 10, // size without header (should be less than 128)
                        0, 0, // flags
                        0 // encoding
                    ].concat(type.mime)
                    .concat([0, 3, 0]) // delemiter, pic type, delemiter
                    .concat(type.signature)
                    .concat(content)
                ));
            });
        });

    });

    describe('musicmetadata', function () {

        it('should return an error if there is no tag', function (done) {
            ajax(assetsPath + 'the_decant_session.mp3', function (arrayBuffer) {
                var writer = new ID3Writer(arrayBuffer);
                musicmetadata(writer.getBlob(), function (err, res) {
                    expect(err).to.be.instanceof(Error);
                    expect(err.message).to.be.equal('Could not find metadata header');
                    done();
                });
            });
        });

        it('reading frames should give the same result as writing', function (done) {
            ajax(assetsPath + 'the_decant_session.mp3', function (songArrayBuffer) {
                ajax(assetsPath + 'cover.jpg', function (coverArrayBuffer) {
                    var writer = new ID3Writer(songArrayBuffer);
                    writer.setFrame('TIT2', 'Home')
                        .setFrame('TPE1', ['Eminem', '50 Cent'])
                        .setFrame('TPE2', 'Eminem')
                        .setFrame('TALB', 'Friday Night Lights')
                        .setFrame('TYER', 2004)
                        .setFrame('TRCK', '6/8')
                        .setFrame('TPOS', '1/2')
                        .setFrame('TCON', ['Soundtrack'])
                        .setFrame('APIC', coverArrayBuffer);
                    writer.addTag();
                    writer.addTag(); // test removing existing frame
                    musicmetadata(writer.getBlob(), function (err, tag) {
                        expect(err).to.be.an('undefined');
                        expect(tag.title).to.be.equal('Home');
                        expect(tag.artist[0]).to.be.equal('Eminem/50 Cent'); // https://github.com/leetreveil/musicmetadata/issues/105
                        expect(tag.albumartist[0]).to.be.equal('Eminem');
                        expect(tag.album).to.be.equal('Friday Night Lights');
                        expect(tag.year).to.be.equal('2004');
                        expect(tag.track.no).to.be.equal(6);
                        expect(tag.track.of).to.be.equal(8);
                        expect(tag.disk.no).to.be.equal(1);
                        expect(tag.disk.of).to.be.equal(2);
                        expect(tag.genre[0]).to.be.equal('Soundtrack');
                        expect(tag.picture[0].format).to.be.equal('jpg');
                        expect(tag.picture[0].data.length).to.be.equal(7168);
                        done();
                    });
                });
            });
        });

    });

});
