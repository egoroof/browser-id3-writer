module.exports = (config) => {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        files: [
            'dist/browser-id3-writer.min.js',
            'test/common.js',
            'test/browser.js',
            {
                pattern: 'test/assets/song.mp3',
                included: false,
                served: true
            }
        ],
        reporters: ['dots'],
        browsers: process.env.CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE', 'Edge'],
        singleRun: true
    });
};
