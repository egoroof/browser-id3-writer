(function () {
    'use strict';

    function uint32ToUint8Array(uint32) {
        var uint8array = [];
        var eightBitMask = (1 << 8) - 1;
        for (var i = 24; i >= 0; i -= 8) {
            uint8array.push((uint32 >>> i) & eightBitMask);
        }
        return uint8array;
    }

    function uint28ToUint7Array(uint28) {
        var uint7array = [];
        var sevenBitMask = (1 << 7) - 1;
        for (var i = 21; i >= 0; i -= 7) {
            uint7array.push((uint28 >>> i) & sevenBitMask);
        }
        return uint7array;
    }

    function uint7ArrayToUint28(uint7Array) {
        var uint28 = 0;
        for (var pow = 21, i = 0; pow >= 0; pow -= 7, i++) {
            uint28 += uint7Array[i] << pow;
        }
        return uint28;
    }

    function artistsToStr(artists) {
        return artists.join('/') || 'Unknown Artist';
    }

    function genresToStr(genres) {
        // this delimiter works fine in Windows Explorer but nothing said about it in the spec
        return genres.join(';');
    }

    function getTotalFrameSize(frames) {
        var size = 0;
        frames.forEach(function (frame) {
            size += frame.size;
        });
        return size;
    }

    function getNumericFrameSize(frameSize) {
        var headerSize = 10;
        var encodingSize = 1;
        return headerSize + encodingSize + frameSize;
    }

    function getStringFrameSize(frameSize) {
        var headerSize = 10;
        var encodingSize = 1;
        var bomSize = 2;
        var frameUtf16Size = frameSize * 2;
        return headerSize + encodingSize + bomSize + frameUtf16Size;
    }

    function getLyricsFrameSize(lyricsSize) {
        var headerSize = 10;
        var encodingSize = 1;
        var languageSize = 3;
        var contentDescriptorSize = 2;
        var lyricsUtf16Size = lyricsSize * 2;
        return headerSize + encodingSize + languageSize + contentDescriptorSize + lyricsUtf16Size;
    }

    function getPictureFrameSize(frameSize, mimeTypeSize) {
        var headerSize = 10;
        var encodingSize = 1;
        var nullSize = 1;
        var pictureTypeSize = 1;
        return headerSize + encodingSize + mimeTypeSize + nullSize + pictureTypeSize + nullSize + frameSize;
    }

    function getBufferMimeType(buf) {
        // https://github.com/sindresorhus/file-type
        if (!buf || !buf.length) {
            return null;
        }
        if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
            return 'image/jpeg';
        }
        if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
            return 'image/png';
        }
        if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
            return 'image/gif';
        }
        if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
            return 'image/webp';
        }
        var isLeTiff = (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2a && buf[3] === 0);
        var isBeTiff = (buf[0] === 0x4d && buf[1] === 0x4d && buf[2] === 0 && buf[3] === 0x2a);
        if (isLeTiff || isBeTiff) {
            return 'image/tiff';
        }
        if (buf[0] === 0x42 && buf[1] === 0x4d) {
            return 'image/bmp';
        }
        if (buf[0] === 0 && buf[1] === 0 && buf[2] === 1 && buf[3] === 0) {
            return 'image/x-icon';
        }
        return null;
    }

    function Writer(arrayBuffer) {
        if (!arrayBuffer || arrayBuffer.constructor !== ArrayBuffer) {
            throw new Error('First argument should be an instance of ArrayBuffer');
        }
        this.arrayBuffer = arrayBuffer;
        this.padding = 4096;
        this.frames = [];
        this.url = '';
    }

    Writer.prototype.setFrame = function (frameName, frameValue) {
        var that = this;

        function setIntegerFrame(frameName, frameValue) {
            var integer = parseInt(frameValue, 10);
            that.frames.push({
                name: frameName,
                value: integer,
                size: getNumericFrameSize(integer.toString().length)
            });
        }

        function setStringFrame(frameName, frameValue) {
            var stringValue = frameValue.toString();
            that.frames.push({
                name: frameName,
                value: stringValue,
                size: getStringFrameSize(stringValue.length)
            });
        }

        function setPictureFrame(frameName, picArrayBuffer) {
            var mimeType = getBufferMimeType(new Uint8Array(picArrayBuffer), 0, 12);
            if (!mimeType) {
                throw new Error('Unknown picture MIME type');
            }
            that.frames.push({
                name: frameName,
                value: picArrayBuffer,
                mimeType: mimeType,
                size: getPictureFrameSize(picArrayBuffer.byteLength, mimeType.length)
            });
        }

        function setLyricsFrame(frameName, lyrics) {
            var stringValue = lyrics.toString();
            that.frames.push({
                name: frameName,
                value: stringValue,
                size: getLyricsFrameSize(stringValue.length)
            });
        }

        switch (frameName) {
            case 'TPE1': // song artists
            case 'TCOM': // song composers
                if (!Array.isArray(frameValue)) {
                    throw new Error(frameName + ' frame value should be an array of strings');
                }
                var artists = frameValue.map(function (artist) {
                    return artist.toString();
                });
                var artistsStr = artistsToStr(artists);
                setStringFrame(frameName, artistsStr);
                break;
            case 'TCON': // song genre
                if (!Array.isArray(frameValue)) {
                    throw new Error(frameName + ' frame value should be an array of strings');
                }
                var frames = frameValue.map(function (frame) {
                    return frame.toString();
                });
                var genresStr = genresToStr(frames);
                setStringFrame(frameName, genresStr);
                break;
            case 'TIT2': // song title
            case 'TALB': // album title
            case 'TPE2': // album artist // spec doesn't say anything about separator, so it is a string, not array
            case 'TRCK': // song number in album: 5 or 5/10
            case 'TPOS': // album disc number: 1 or 1/3
                setStringFrame(frameName, frameValue);
                break;
            case 'TLEN': // song duration
            case 'TYER': // album release year
                setIntegerFrame(frameName, frameValue);
                break;
            case 'USLT': // unsychronised lyrics
                setLyricsFrame(frameName, frameValue);
                break;
            case 'APIC': // song cover
                setPictureFrame(frameName, frameValue);
                break;
            default:
                throw new Error('Unsupported frame ' + frameName);
        }
        return this;
    };

    Writer.prototype.removeTag = function () {
        var headerLength = 10;
        var bufferLength = this.arrayBuffer.byteLength;
        if (bufferLength < headerLength) {
            return;
        }
        var firstTenBytes = new Uint8Array(this.arrayBuffer, 0, headerLength);
        var isID3tag = (firstTenBytes[0] === 0x49 && firstTenBytes[1] === 0x44 && firstTenBytes[2] === 0x33);
        if (!isID3tag) {
            return;
        }
        var version = firstTenBytes[3];
        if (version < 2 || version > 4) {
            return;
        }
        var tagSize = uint7ArrayToUint28([
            firstTenBytes[6], firstTenBytes[7],
            firstTenBytes[8], firstTenBytes[9]
        ]);
        this.arrayBuffer = this.arrayBuffer.slice(tagSize + headerLength);
    };

    Writer.prototype.addTag = function () {
        this.removeTag(); // to be sure there is no other tags
        var offset = 0;
        var headerSize = 10;
        var totalFrameSize = getTotalFrameSize(this.frames);
        var totalTagSize = headerSize + totalFrameSize + this.padding;
        var buffer = new ArrayBuffer(this.arrayBuffer.byteLength + totalTagSize);
        var bufferWriter = new Uint8Array(buffer);
        var coder8 = new TextEncoder('utf-8');
        var coder16 = new TextEncoder('utf-16le');

        var writeBytes = [0x49, 0x44, 0x33, 3]; // ID3 tag and version
        bufferWriter.set(writeBytes, offset);
        offset += writeBytes.length;

        offset++; // version revision
        offset++; // flags

        writeBytes = uint28ToUint7Array(totalTagSize - headerSize); // tag size (without header)
        bufferWriter.set(writeBytes, offset);
        offset += writeBytes.length;

        this.frames.forEach(function (frame) {
            writeBytes = coder8.encode(frame.name); // frame name
            bufferWriter.set(writeBytes, offset);
            offset += writeBytes.length;

            writeBytes = uint32ToUint8Array(frame.size - headerSize); // frame size (without header)
            bufferWriter.set(writeBytes, offset);
            offset += writeBytes.length;

            offset += 2; // flags

            switch (frame.name) {
                case 'TPE1':
                case 'TCOM':
                case 'TCON':
                case 'TIT2':
                case 'TALB':
                case 'TPE2':
                case 'TRCK':
                case 'TPOS':
                    writeBytes = [1, 0xff, 0xfe]; // encoding and BOM
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = coder16.encode(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                case 'USLT':
                    var langEng = [101, 110, 103];
                    writeBytes = [1].concat(langEng); // encoding and language
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    offset += 2; // content descriptor

                    writeBytes = coder16.encode(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                case 'TLEN':
                case 'TYER':
                    offset++; // encoding

                    writeBytes = coder8.encode(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                case 'APIC':
                    offset++; // encoding

                    writeBytes = coder8.encode(frame.mimeType); // MIME type
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = [0, 3, 0]; // delemiter, pic type, delemiter
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    bufferWriter.set(new Uint8Array(frame.value), offset); // picture content
                    offset += frame.value.byteLength;
                    break;
            }
        });

        offset += this.padding; // free space for rewriting
        bufferWriter.set(new Uint8Array(this.arrayBuffer), offset);
        this.arrayBuffer = buffer;
        return buffer;
    };

    Writer.prototype.getBlob = function () {
        return new Blob([this.arrayBuffer], {type: 'audio/mpeg'});
    };

    Writer.prototype.getURL = function () {
        if (!this.url) {
            this.url = URL.createObjectURL(this.getBlob());
        }
        return this.url;
    };

    Writer.prototype.revokeURL = function () {
        URL.revokeObjectURL(this.url);
    };

    window.ID3Writer = Writer;

})();
