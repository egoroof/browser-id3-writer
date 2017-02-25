module.exports = {
    entry: './src/ID3Writer.js',
    output: {
        path: './dist',
        filename: 'browser-id3-writer.js',
        library: 'ID3Writer',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['env']
            }
        }]
    }
};
