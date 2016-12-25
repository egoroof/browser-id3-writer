const tests = require('./common');

tests.forEach((testPack) => {
    describe(testPack.describe, () => {
        testPack.it.forEach((test) => {
            it(test.describe, test.test.bind(null, ID3Writer, expect));
        });
    });
});

function ajax(url, onSuccess, onError) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
        if (xhr.status === 200) {
            onSuccess(xhr.response);
        } else {
            onError(new Error(`${xhr.statusText} (${xhr.status})`));
        }
    };
    xhr.onerror = function () {
        onError(new Error('Network error'));
    };
    xhr.send();
}

describe('browser usage', () => {
    it('should load song and change byte length after adding a tag', (done) => {
        ajax('/base/test/assets/song.mp3', (arrayBuffer) => {
            expect(arrayBuffer.byteLength).to.be.equal(613772);

            const writer = new ID3Writer(arrayBuffer);
            writer.setFrame('TIT2', 'Home')
                .setFrame('TPE1', ['Eminem', '50 Cent'])
                .setFrame('TPE2', 'Eminem')
                .setFrame('TPE4', 'Daft Punk')
                .setFrame('TALB', 'Friday Night Lights')
                .setFrame('TYER', 2004)
                .setFrame('TRCK', '6/8')
                .setFrame('TPOS', '1/2')
                .setFrame('TCON', ['Soundtrack'])
                .setFrame('USLT', {
                    description: 'Текст песенки',
                    lyrics: 'This is unsychronised lyrics'
                })
                .setFrame('TXXX', {
                    description: 'Release Info',
                    value: 'Double vinyl version was limited to 2500 copies'
                })
                .setFrame('COMM', {
                    description: 'This is description of comment',
                    text: 'And this is the comment'
                })
                .setFrame('WCOM', 'https://google.com/')
                .setFrame('WCOP', 'https://google.com/')
                .setFrame('WOAF', 'https://google.com/')
                .setFrame('WOAR', 'https://google.com/')
                .setFrame('WOAS', 'https://google.com/')
                .setFrame('WORS', 'https://google.com/')
                .setFrame('WPAY', 'https://google.com/')
                .setFrame('WPUB', 'https://google.com/')
                .setFrame('TKEY', 'Fbm')
                .setFrame('TMED', 'TT/45');
            writer.addTag();

            expect(writer.arrayBuffer.byteLength).to.be.equal(618770);
            done();
        });
    });
});
