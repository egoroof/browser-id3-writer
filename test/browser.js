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
                .setFrame('TALB', 'Friday Night Lights')
                .setFrame('TYER', 2004)
                .setFrame('TRCK', '6/8')
                .setFrame('TPOS', '1/2')
                .setFrame('TCON', ['Soundtrack'])
                .setFrame('USLT', 'This is unsychronised lyrics');
            writer.addTag();

            expect(writer.arrayBuffer.byteLength).to.be.equal(618178);
            done();
        });
    });
});
