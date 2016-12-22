const encoder = require('./encoder');
const signatures = require('./signatures');
const transform = require('./transform');
const sizes = require('./sizes');

class Writer {

    _setIntegerFrame(name, value) {
        const integer = parseInt(value, 10);

        this.frames.push({
            name,
            value: integer,
            size: sizes.getNumericFrameSize(integer.toString().length)
        });
    }

    _setStringFrame(name, value) {
        const stringValue = value.toString();

        this.frames.push({
            name,
            value: stringValue,
            size: sizes.getStringFrameSize(stringValue.length)
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
            size: sizes.getPictureFrameSize(buffer.byteLength, mimeType.length)
        });
    }

    _setLyricsFrame(name, lyrics) {
        const stringValue = lyrics.toString();

        this.frames.push({
            name,
            value: stringValue,
            size: sizes.getLyricsFrameSize(stringValue.length)
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
            case 'TCOM': { // song composers
                if (!Array.isArray(frameValue)) {
                    throw new Error(`${frameName} frame value should be an array of strings`);
                }
                const artists = frameValue.join('/');

                this._setStringFrame(frameName, artists);
                break;
            }
            case 'TCON': { // song genre
                if (!Array.isArray(frameValue)) {
                    throw new Error(`${frameName} frame value should be an array of strings`);
                }
                const genres = frameValue.join(';');

                this._setStringFrame(frameName, genres);
                break;
            }
            case 'TIT2': // song title
            case 'TALB': // album title
            case 'TPE2': // album artist // spec doesn't say anything about separator, so it is a string, not array
            case 'TRCK': // song number in album: 5 or 5/10
            case 'TPOS': // album disc number: 1 or 1/3
            case 'TPUB': { // label name
                this._setStringFrame(frameName, frameValue);
                break;
            }
            case 'TLEN': // song duration
            case 'TYER': { // album release year
                this._setIntegerFrame(frameName, frameValue);
                break;
            }
            case 'USLT': { // unsychronised lyrics
                this._setLyricsFrame(frameName, frameValue);
                break;
            }
            case 'APIC': { // song cover
                if (typeof frameValue !== 'object' || !('byteLength' in frameValue)) {
                    throw new Error('APIC frame value should be an instance of ArrayBuffer or Buffer');
                }
                this._setPictureFrame(frameName, frameValue);
                break;
            }
            default: {
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
        const tagSize = transform.uint7ArrayToUint28([
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
        const totalFrameSize = sizes.getTotalFrameSize(this.frames);
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

        writeBytes = transform.uint28ToUint7Array(totalTagSize - headerSize); // tag size (without header)
        bufferWriter.set(writeBytes, offset);
        offset += writeBytes.length;

        this.frames.forEach((frame) => {
            writeBytes = encoder.encodeUtf8Ascii(frame.name); // frame name
            bufferWriter.set(writeBytes, offset);
            offset += writeBytes.length;

            writeBytes = transform.uint32ToUint8Array(frame.size - headerSize); // frame size (without header)
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
                case 'TPUB': {
                    writeBytes = [1].concat(BOM); // encoding, BOM
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = encoder.encodeUtf16le(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'USLT': {
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
                case 'TYER': {
                    offset++; // encoding

                    writeBytes = encoder.encodeUtf8Ascii(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'APIC': {
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
