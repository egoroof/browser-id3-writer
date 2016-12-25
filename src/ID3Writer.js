import * as encoder from './encoder';
import * as signatures from './signatures';
import * as transform from './transform';
import * as sizes from './sizes';

class ID3Writer {

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

    _setPictureFrame(pictureType, data, description) {
        const mimeType = signatures.getMimeType(new Uint8Array(data));
        const descriptionString = description.toString();

        if (!mimeType) {
            throw new Error('Unknown picture MIME type');
        }
        this.frames.push({
            name: 'APIC',
            value: data,
            pictureType,
            mimeType,
            description: descriptionString,
            size: sizes.getPictureFrameSize(data.byteLength, mimeType.length, descriptionString.length)
        });
    }

    _setLyricsFrame(description, lyrics) {
        const descriptionString = description.toString();
        const lyricsString = lyrics.toString();

        this.frames.push({
            name: 'USLT',
            value: lyricsString,
            description: descriptionString,
            size: sizes.getLyricsFrameSize(descriptionString.length, lyricsString.length)
        });
    }

    _setCommentFrame(description, text) {
        const descriptionString = description.toString();
        const textString = text.toString();

        this.frames.push({
            name: 'COMM',
            value: textString,
            description: descriptionString,
            size: sizes.getCommentFrameSize(descriptionString.length, textString.length)
        });
    }

    _setUserStringFrame(description, value) {
        const descriptionString = description.toString();
        const valueString = value.toString();

        this.frames.push({
            name: 'TXXX',
            description: descriptionString,
            value: valueString,
            size: sizes.getUserStringFrameSize(descriptionString.length, valueString.length)
        });
    }

    _setUrlLinkFrame(name, url) {
        const urlString = url.toString();

        this.frames.push({
            name,
            value: urlString,
            size: sizes.getUrlLinkFrameSize(urlString.length)
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
            case 'TCON': { // song genres
                if (!Array.isArray(frameValue)) {
                    throw new Error(`${frameName} frame value should be an array of strings`);
                }
                const delemiter = frameName === 'TCON' ? ';' : '/';
                const value = frameValue.join(delemiter);

                this._setStringFrame(frameName, value);
                break;
            }
            case 'TIT2': // song title
            case 'TALB': // album title
            case 'TPE2': // album artist // spec doesn't say anything about separator, so it is a string, not array
            case 'TRCK': // song number in album: 5 or 5/10
            case 'TPOS': // album disc number: 1 or 1/3
            case 'TMED': // media type
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
                if (typeof frameValue !== 'object' || !('description' in frameValue) || !('lyrics' in frameValue)) {
                    throw new Error('USLT frame value should be an object with keys description and lyrics');
                }
                this._setLyricsFrame(frameValue.description, frameValue.lyrics);
                break;
            }
            case 'APIC': { // song cover
                if (typeof frameValue !== 'object' || !('type' in frameValue) || !('data' in frameValue) || !('description' in frameValue)) {
                    throw new Error('APIC frame value should be an object with keys type, data and description');
                }
                if (frameValue.type < 0 || frameValue.type > 20) {
                    throw new Error('Incorrect APIC frame picture type');
                }
                this._setPictureFrame(frameValue.type, frameValue.data, frameValue.description);
                break;
            }
            case 'TXXX': { // user defined text information
                if (typeof frameValue !== 'object' || !('description' in frameValue) || !('value' in frameValue)) {
                    throw new Error('TXXX frame value should be an object with keys description and value');
                }
                this._setUserStringFrame(frameValue.description, frameValue.value);
                break;
            }
            case 'TKEY': { // musical key in which the sound starts
                if (!/^([A-G][#b]?m?|o)$/.test(frameValue)) {
                    //specs: The ground keys are represented with "A","B","C","D","E",
                    //"F" and "G" and halfkeys represented with "b" and "#". Minor is
                    //represented as "m", e.g. "Dbm". Off key is represented with an
                    //"o" only.
                    throw new Error(`${frameName} frame value should be like Dbm, C#, B or o`);
                }
                this._setStringFrame(frameName, frameValue);
                break;
            }
            case 'WCOM': // Commercial information
            case 'WCOP': // Copyright/Legal information
            case 'WOAF': // Official audio file webpage
            case 'WOAR': // Official artist/performer webpage
            case 'WOAS': // Official audio source webpage
            case 'WORS': // Official internet radio station homepage
            case 'WPAY': // Payment
            case 'WPUB': { // Publishers official webpage
                this._setUrlLinkFrame(frameName, frameValue);
                break;
            }
            case 'COMM': { // Comments
                if (typeof frameValue !== 'object' || !('description' in frameValue) || !('text' in frameValue)) {
                    throw new Error('COMM frame value should be an object with keys description and text');
                }
                this._setCommentFrame(frameValue.description, frameValue.text);
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
        const langEng = [0x65, 0x6e, 0x67];
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
            writeBytes = encoder.encodeWindows1252(frame.name); // frame name
            bufferWriter.set(writeBytes, offset);
            offset += writeBytes.length;

            writeBytes = transform.uint32ToUint8Array(frame.size - headerSize); // frame size (without header)
            bufferWriter.set(writeBytes, offset);
            offset += writeBytes.length;

            offset += 2; // flags

            switch (frame.name) {
                case 'WCOM':
                case 'WCOP':
                case 'WOAF':
                case 'WOAR':
                case 'WOAS':
                case 'WORS':
                case 'WPAY':
                case 'WPUB': {
                    writeBytes = encoder.encodeWindows1252(frame.value); // URL
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'TPE1':
                case 'TCOM':
                case 'TCON':
                case 'TIT2':
                case 'TALB':
                case 'TPE2':
                case 'TRCK':
                case 'TPOS':
                case 'TKEY':
                case 'TMED':
                case 'TPUB': {
                    writeBytes = [1].concat(BOM); // encoding, BOM
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = encoder.encodeUtf16le(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'TXXX':
                case 'USLT':
                case 'COMM': {
                    writeBytes = [1]; // encoding
                    if (frame.name === 'USLT' || frame.name === 'COMM') {
                        writeBytes = writeBytes.concat(langEng); // language
                    }
                    writeBytes = writeBytes.concat(BOM); // BOM for content descriptor
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = encoder.encodeUtf16le(frame.description); // content descriptor
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = [0, 0].concat(BOM); // separator, BOM for frame value
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

                    writeBytes = encoder.encodeWindows1252(frame.value); // frame value
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;
                    break;
                }
                case 'APIC': {
                    writeBytes = [1]; // encoding
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = encoder.encodeWindows1252(frame.mimeType); // MIME type
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = [0, frame.pictureType].concat(BOM); // separator, pic type, BOM
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    writeBytes = encoder.encodeUtf16le(frame.description); // description
                    bufferWriter.set(writeBytes, offset);
                    offset += writeBytes.length;

                    offset += 2; // separator

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

module.exports = ID3Writer;
