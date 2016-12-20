const babelConfig = require('./.babelrc.json');

module.exports = (config) => {
    config.set({
        basePath: '../',
        frameworks: ['mocha', 'chai'],
        files: [
            'dist/browser-id3-writer.min.js',
            'test/browser.js',
            {
                pattern: 'test/assets/song.mp3',
                included: false,
                served: true
            }
        ],
        preprocessors: {
            'test/browser.js': ['webpack']
        },
        reporters: ['dots'],
        logLevel: config.LOG_INFO,
        browsers: process.env.CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE', 'Edge'],
        webpack: {
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: babelConfig
                }]
            }
        },
        webpackMiddleware: {
            noInfo: true
        }
    });
};
