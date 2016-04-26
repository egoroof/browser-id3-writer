const tests = require('./common');
const expect = require('chai').expect;
const ID3Writer = require('../dist/browser-id3-writer.min');

tests.forEach((testPack) => {
    describe(testPack.describe, () => {
        testPack.it.forEach((test) => {
            it(test.describe, test.test.bind(null, ID3Writer, expect));
        });
    });
});
