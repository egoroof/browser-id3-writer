const tests = require('./common');
const expect = require('chai').expect;
const ID3Writer = require('../dist/browser-id3-writer.min');
const fs = require('fs');
const path = require('path');
const assetFolder = path.join(__dirname, 'assets');

tests.forEach((testPack) => {
    describe(testPack.describe, () => {
        testPack.it.forEach((test) => {
            it(test.describe, test.test.bind(null, ID3Writer, expect));
        });
    });
});

describe('node usage', () => {
    it('should read assets and write tagged song', () => {
        const songBuffer = fs.readFileSync(path.join(assetFolder, 'song.mp3'));
        const coverBuffer = fs.readFileSync(path.join(assetFolder, 'cover.jpg'));
        expect(songBuffer.byteLength).to.be.equal(613772);
        expect(coverBuffer.byteLength).to.be.equal(50490);

        const writer = new ID3Writer(songBuffer);
        writer.setFrame('TIT2', 'Home')
            .setFrame('TPE1', ['Eminem', '50 Cent'])
            .setFrame('TPE2', 'Eminem')
            .setFrame('TPE3', 'FooComposer')
            .setFrame('TPE4', 'Daft Punk')
            .setFrame('TALB', 'Friday Night Lights')
            .setFrame('TYER', 2004)
            .setFrame('TRCK', '6/8')
            .setFrame('TPOS', '1/2')
            .setFrame('TBPM', '128')
            .setFrame('TKEY', 'Fbm')
            .setFrame('TCON', ['Soundtrack'])
            .setFrame('TMED', 'TT/45')
            .setFrame('TMOO', 'Happy')
            .setFrame('TSOA', 'Friday Night Lights')
            .setFrame('TSOP', 'Eminem')
            .setFrame('TSOT', 'Home')
            .setFrame('USLT', 'This is unsychronised lyrics')
            .setFrame('TXXX', {
                description: 'Release Info',
                value: 'Double vinyl version was limited to 2500 copies'
            })
            .setFrame('APIC', coverBuffer);
        writer.addTag();
        expect(writer.arrayBuffer.byteLength).to.be.equal(669072);

        const taggedSongBuffer = new Buffer(writer.arrayBuffer);
        expect(taggedSongBuffer.byteLength).to.be.equal(669072);
        fs.writeFileSync(path.join(assetFolder, 'song_with_tags.mp3'), taggedSongBuffer);
    });
});
