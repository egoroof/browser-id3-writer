module.exports = (config) => {
    const CI = process.env.CI;

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
        browsers: CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE'],
        webpack: {
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['latest']
                    }
                }]
            }
        },
        webpackMiddleware: {
            noInfo: true
        }
    });
};
