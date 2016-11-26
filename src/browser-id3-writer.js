const encoder = require('./encoder');
const signatures = require('./signatures');

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
    const bomSize = 2;
    const lyricsUtf16Size = lyricsSize * 2;

    return headerSize + encodingSize + languageSize + bomSize + contentDescriptorSize + bomSize + lyricsUtf16Size;
}

function getPictureFrameSize(frameSize, mimeTypeSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const nullSize = 1;
    const pictureTypeSize = 1;

    return headerSize + encodingSize + mimeTypeSize + nullSize + pictureTypeSize + nullSize + frameSize;
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
        const mimeType = signatures.getMimeType(new Uint8Array(buffer), 0, 12);

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
        if (!buffer || typeof buffer !== 'object' || !('byteLength' in buffer)) {
            throw new Error('First argument should be an instance of ArrayBuffer or Buffer');
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
            case 'TKEY': // musical key in which the sound starts
            {
                if(!/^([A-G][#b]?m?|o)$/.test(frameValue)) {
                    //specs: The ground keys are represented with "A","B","C","D","E",
                    //"F" and "G" and halfkeys represented with "b" and "#". Minor is
                    //represented as "m", e.g. "Dbm". Off key is represented with an
                    //"o" only.
                    throw new Error(`${frameName} frame value should be like Dbm, C#, B or o`);
                }
                this._setStringFrame(frameName, frameValue);
                break;
            }
            case 'TIT2': // song title
            case 'TALB': // album title
            case 'TPE2': // album artist // spec doesn't say anything about separator, so it is a string, not array
            case 'TPE3': // name of the conductor
            case 'TPE4': // people behind a remix and similar interpretations
            case 'TRCK': // song number in album: 5 or 5/10
            case 'TPOS': // album disc number: 1 or 1/3
            case 'TPUB': // label name
            case 'TBPM': // number of beats per minute //specs say it is an int and represented as a numerical string
            case 'TMED': // media the sound originated from (eg. DIG, CD, TT/33, VID/PAL, RAD/FM, etc)
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
                if (typeof frameValue !== 'object' || !('byteLength' in frameValue)) {
                    throw new Error('APIC frame value should be an instance of ArrayBuffer or Buffer');
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
        const version = firstTenBytes[3];
        const tagSize = uint7ArrayToUint28([
                firstTenBytes[6], firstTenBytes[7],
                firstTenBytes[8], firstTenBytes[9]
            ]) + headerLength;

        if (!signatures.isId3v2(firstTenBytes) || version < 2 || version > 4) {
            return;
        }

        this.arrayBuffer = this.arrayBuffer.slice(tagSize);
    }

    addTag() {
        this.removeTag();

        const BOM = [0xff, 0xfe];
        const headerSize = 10;
        const totalFrameSize = getTotalFrameSize(this.frames);
        const totalTagSize = headerSize + totalFrameSize + this.padding;
        const buffer = new ArrayBuffer(this.arrayBuffer.byteLength + totalTagSize);
        const bufferWriter = new Uint8Array(buffer);

        let offset = 0;
        let writeBytes = [];

        writeBytes = [0x49, 0x44, 0x33, 3]; // ID3 tag and version
        bufferWriter.set(writeBytes, offset);
        offset += writeBytes.length;

        offset++; // version revision
        offset++; // flags

        writeBytes = uint28ToUint7Array(totalTagSize - headerSize); // tag size (without header)
        bufferWriter.set(writeBytes, offset);
        offset += writeBytes.length;

        this.frames.forEach((frame) => {
            writeBytes = encoder.encodeUtf8Ascii(frame.name); // frame name
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
                case 'TPE3':
                case 'TPE4':
                case 'TRCK':
                case 'TPOS':
                case 'TPUB':
                case 'TBPM':
                case 'TKEY':
                case 'TMED':
                {
                    writeBytes = [1].concat(BOM); // encoding, BOM
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = encoder.encodeUtf16le(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'USLT':
                {
                    const langEng = [101, 110, 103];

                    writeBytes = [1].concat(langEng, BOM); // encoding, language, BOM for content descriptor
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    offset += 2; // content descriptor

                    writeBytes = BOM; // BOM for frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = encoder.encodeUtf16le(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'TLEN':
                case 'TYER':
                {
                    offset++; // encoding

                    writeBytes = encoder.encodeUtf8Ascii(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'APIC':
                {
                    offset++; // encoding

                    writeBytes = encoder.encodeUtf8Ascii(frame.mimeType); // MIME type
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
