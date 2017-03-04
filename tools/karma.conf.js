const pack = require('../package.json');
const browsers = ['Firefox'];

if (!process.env.CI) {
    browsers.push('Chrome');
    switch (process.platform) {
        case 'darwin':
            browsers.push('Safari');
            break;
        case 'win32':
            browsers.push('IE');
            browsers.push('Edge');
            break;
    }
}

module.exports = (config) => {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        files: [
            pack.main,
            'test/common.js',
            'test/browser.js',
            {
                pattern: 'test/assets/song.mp3',
                included: false,
                served: true
            }
        ],
        reporters: ['dots'],
        browsers: browsers,
        singleRun: true,
        concurrency: 1,
        logLevel: config.LOG_WARN
    });
};
