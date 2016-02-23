module.exports = (config) => {
    const CI = process.env.CI;

    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: [
            'https://npmcdn.com/text-encoding@0.5.2/lib/encoding.js',
            'https://npmcdn.com/musicmetadata@2.0.2/dist/musicmetadata.js',
            {
                pattern: 'test/assets/*',
                included: false,
                served: true
            },
            {
                pattern: 'dist/browser-id3-writer.min.js.map',
                included: false,
                served: true
            },
            'dist/browser-id3-writer.min.js',
            'test/**/*.test.js'
        ],
        preprocessors: {
            'test/**/*.js': ['webpack']
        },
        reporters: ['dots'],
        autoWatch: true,
        colors: true,
        singleRun: false,
        logLevel: config.LOG_INFO,
        browsers: CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE'],
        concurrency: Infinity,
        webpack: {
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader'
                    }
                ]
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
