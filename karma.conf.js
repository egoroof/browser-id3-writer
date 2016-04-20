module.exports = (config) => {
    const CI = process.env.CI;

    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        files: [
            'dist/browser-id3-writer.min.js',
            'test/**/*.test.js'
        ],
        preprocessors: {
            'test/**/*.js': ['babel']
        },
        reporters: ['dots'],
        autoWatch: true,
        colors: true,
        singleRun: false,
        logLevel: config.LOG_INFO,
        browsers: CI ? ['Firefox'] : ['Chrome', 'Firefox', 'IE'],
        concurrency: Infinity
    });
};
