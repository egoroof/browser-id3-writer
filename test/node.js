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
            .setFrame('TALB', 'Friday Night Lights')
            .setFrame('TYER', 2004)
            .setFrame('TRCK', '6/8')
            .setFrame('TPOS', '1/2')
            .setFrame('TCON', ['Soundtrack'])
            .setFrame('USLT', {
                description: 'Текст песенки',
                lyrics: 'This is unsychronised lyrics'
            })
            .setFrame('COMM', {
                description: 'This is description of comment',
                text: 'And this is the comment'
            })
            .setFrame('TXXX', {
                description: 'Release Info',
                value: 'Double vinyl version was limited to 2500 copies'
            })
            .setFrame('WCOM', 'https://google.com/')
            .setFrame('WCOP', 'https://google.com/')
            .setFrame('WOAF', 'https://google.com/')
            .setFrame('WOAR', 'https://google.com/')
            .setFrame('WOAS', 'https://google.com/')
            .setFrame('WORS', 'https://google.com/')
            .setFrame('WPAY', 'https://google.com/')
            .setFrame('WPUB', 'https://google.com/')
            .setFrame('APIC', {
                type: 3,
                data: coverBuffer,
                description: 'Super picture'
            });
        writer.addTag();

        const taggedSongBuffer = new Buffer(writer.arrayBuffer);
        expect(taggedSongBuffer.byteLength).to.be.equal(669240);
        fs.writeFileSync(path.join(assetFolder, 'song_with_tags.mp3'), taggedSongBuffer);
    });
});
