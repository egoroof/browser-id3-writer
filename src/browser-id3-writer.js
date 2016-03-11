function uint32ToUint8Array(uint32) {
    const uint8array = [];
    const eightBitMask = (1 << 8) - 1;

    for (let i = 24; i >= 0; i -= 8) {
        uint8array.push((uint32 >>> i) & eightBitMask);
    }
    return uint8array;
}

function uint28ToUint7Array(uint28) {
    const uint7array = [];
    const sevenBitMask = (1 << 7) - 1;

    for (let i = 21; i >= 0; i -= 7) {
        uint7array.push((uint28 >>> i) & sevenBitMask);
    }
    return uint7array;
}

function uint7ArrayToUint28(uint7Array) {
    let uint28 = 0;

    for (let i = 0, pow = 21; pow >= 0; pow -= 7, i++) {
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
    let size = 0;

    frames.forEach((frame) => {
        size += frame.size;
    });
    return size;
}

function getNumericFrameSize(frameSize) {
    const headerSize = 10;
    const encodingSize = 1;

    return headerSize + encodingSize + frameSize;
}

function getStringFrameSize(frameSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const bomSize = 2;
    const frameUtf16Size = frameSize * 2;

    return headerSize + encodingSize + bomSize + frameUtf16Size;
}

function getLyricsFrameSize(lyricsSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const languageSize = 3;
    const contentDescriptorSize = 2;
    const lyricsUtf16Size = lyricsSize * 2;

    return headerSize + encodingSize + languageSize + contentDescriptorSize + lyricsUtf16Size;
}

function getPictureFrameSize(frameSize, mimeTypeSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const nullSize = 1;
    const pictureTypeSize = 1;

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
    const isLeTiff = buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2a && buf[3] === 0;
    const isBeTiff = buf[0] === 0x4d && buf[1] === 0x4d && buf[2] === 0 && buf[3] === 0x2a;

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

class Writer {

    _setIntegerFrame(name, value) {
        const integer = parseInt(value, 10);

        this.frames.push({
            name,
            value: integer,
            size: getNumericFrameSize(integer.toString().length)
        });
    }

    _setStringFrame(name, value) {
        const stringValue = value.toString();

        this.frames.push({
            name,
            value: stringValue,
            size: getStringFrameSize(stringValue.length)
        });
    }

    _setPictureFrame(name, buffer) {
        const mimeType = getBufferMimeType(new Uint8Array(buffer), 0, 12);

        if (!mimeType) {
            throw new Error('Unknown picture MIME type');
        }
        this.frames.push({
            name,
            value: buffer,
            mimeType,
            size: getPictureFrameSize(buffer.byteLength, mimeType.length)
        });
    }

    _setLyricsFrame(name, lyrics) {
        const stringValue = lyrics.toString();

        this.frames.push({
            name,
            value: stringValue,
            size: getLyricsFrameSize(stringValue.length)
        });
    }

    constructor(buffer) {
        if (!buffer || buffer.constructor !== ArrayBuffer) {
            throw new Error('First argument should be an instance of ArrayBuffer');
        }

        const firstThreeBytes = new Uint8Array(buffer, 0, 3);
        const isMp3File = firstThreeBytes[0] === 0xff && firstThreeBytes[1] === 0xfb;
        const isMp3Id3File = firstThreeBytes[0] === 0x49 && firstThreeBytes[1] === 0x44 && firstThreeBytes[2] === 0x33;

        if (!isMp3File && !isMp3Id3File) {
            throw new Error('ArrayBuffer is not an mp3 file or it is corrupted');
        }

        this.arrayBuffer = buffer;
        this.padding = 4096;
        this.frames = [];
        this.url = '';
    }


    setFrame(frameName, frameValue) {
        switch (frameName) {
            case 'TPE1': // song artists
            case 'TCOM': // song composers
            {
                if (!Array.isArray(frameValue)) {
                    throw new Error(`${frameName} frame value should be an array of strings`);
                }
                const artists = frameValue.map((artist) => artist.toString());
                const artistsStr = artistsToStr(artists);

                this._setStringFrame(frameName, artistsStr);
                break;
            }
            case 'TCON': // song genre
            {
                if (!Array.isArray(frameValue)) {
                    throw new Error(`${frameName} frame value should be an array of strings`);
                }
                const frames = frameValue.map((frame) => frame.toString());
                const genresStr = genresToStr(frames);

                this._setStringFrame(frameName, genresStr);
                break;
            }
            case 'TIT2': // song title
            case 'TALB': // album title
            case 'TPE2': // album artist // spec doesn't say anything about separator, so it is a string, not array
            case 'TRCK': // song number in album: 5 or 5/10
            case 'TPOS': // album disc number: 1 or 1/3
            case 'TPUB': // label name
            {
                this._setStringFrame(frameName, frameValue);
                break;
            }
            case 'TLEN': // song duration
            case 'TYER': // album release year
            {
                this._setIntegerFrame(frameName, frameValue);
                break;
            }
            case 'USLT': // unsychronised lyrics
            {
                this._setLyricsFrame(frameName, frameValue);
                break;
            }
            case 'APIC': // song cover
            {
                if (frameValue.constructor !== ArrayBuffer) {
                    throw new Error('APIC frame value should be an instance of ArrayBuffer');
                }
                this._setPictureFrame(frameName, frameValue);
                break;
            }
            default:
            {
                throw new Error(`Unsupported frame ${frameName}`);
            }
        }
        return this;
    }

    removeTag() {
        const headerLength = 10;
        const bufferLength = this.arrayBuffer.byteLength;

        if (bufferLength < headerLength) {
            return;
        }
        const firstTenBytes = new Uint8Array(this.arrayBuffer, 0, headerLength);
        const isId3tag = firstTenBytes[0] === 0x49 && firstTenBytes[1] === 0x44 && firstTenBytes[2] === 0x33;

        if (!isId3tag) {
            return;
        }
        const version = firstTenBytes[3];

        if (version < 2 || version > 4) {
            return;
        }
        const tagSize = uint7ArrayToUint28([
            firstTenBytes[6], firstTenBytes[7],
            firstTenBytes[8], firstTenBytes[9]
        ]);

        this.arrayBuffer = this.arrayBuffer.slice(tagSize + headerLength);
    }

    addTag() {
        this.removeTag(); // to be sure there is no other tags
        let offset = 0;
        const headerSize = 10;
        const totalFrameSize = getTotalFrameSize(this.frames);
        const totalTagSize = headerSize + totalFrameSize + this.padding;
        const buffer = new ArrayBuffer(this.arrayBuffer.byteLength + totalTagSize);
        const bufferWriter = new Uint8Array(buffer);
        const coder8 = new TextEncoder('utf-8');
        const coder16 = new TextEncoder('utf-16le');

        let writeBytes = [0x49, 0x44, 0x33, 3]; // ID3 tag and version

        bufferWriter.set(writeBytes, offset);
        offset += writeBytes.length;

        offset++; // version revision
        offset++; // flags

        writeBytes = uint28ToUint7Array(totalTagSize - headerSize); // tag size (without header)
        bufferWriter.set(writeBytes, offset);
        offset += writeBytes.length;

        this.frames.forEach((frame) => {
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
                case 'TPUB':
                {
                    writeBytes = [1, 0xff, 0xfe]; // encoding and BOM
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = coder16.encode(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'USLT':
                {
                    const langEng = [101, 110, 103];

                    writeBytes = [1].concat(langEng); // encoding and language
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    offset += 2; // content descriptor

                    writeBytes = coder16.encode(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'TLEN':
                case 'TYER':
                {
                    offset++; // encoding

                    writeBytes = coder8.encode(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'APIC':
                {
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
            }
        });

        offset += this.padding; // free space for rewriting
        bufferWriter.set(new Uint8Array(this.arrayBuffer), offset);
        this.arrayBuffer = buffer;
        return buffer;
    }

    getBlob() {
        return new Blob([this.arrayBuffer], {type: 'audio/mpeg'});
    }

    getURL() {
        if (!this.url) {
            this.url = URL.createObjectURL(this.getBlob());
        }
        return this.url;
    }

    revokeURL() {
        URL.revokeObjectURL(this.url);
    }

}

module.exports = Writer;
