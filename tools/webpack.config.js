const babelConfig = require('./.babelrc.json');

module.exports = {
    entry: './src/ID3Writer.js',
    output: {
        path: './dist',
        filename: 'browser-id3-writer.min.js',
        library: 'ID3Writer',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: babelConfig
        }]
    }
};
