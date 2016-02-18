module.exports = function (config) {
    var CI = process.env.CI;

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
            'src/**/*.js',
            'test/**/*.test.js'
        ],
        preprocessors: {'src/**/*.js': ['webpack', 'coverage']},
        reporters: ['progress', 'coverage'],
        coverageReporter: CI ? {
            type: 'lcovonly',
            dir: 'coverage/',
            subdir: '.'
        } : {
            type: 'text-summary'
        },
        autoWatch: true,
        colors: true,
        singleRun: false,
        logLevel: config.LOG_INFO,
        browsers: CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE'],
        concurrency: Infinity,
        webpack: require('./webpack.config'),
        webpackServer: {
            noInfo: true
        }
    });
};
