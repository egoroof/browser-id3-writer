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
        exclude: [],
        preprocessors: {'src/**/*.js': ['coverage']},
        reporters: ['progress', 'coverage'],
        coverageReporter: {type: 'text-summary'},
        port: 9876,
        browserDisconnectTimeout: 4000,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: CI ? ['PhantomJS', 'Firefox'] : ['Chrome', 'Firefox', 'IE'],
        singleRun: false,
        concurrency: Infinity,
        client: {
            mocha: {
                timeout: 10000
            }
        }
    });
};
