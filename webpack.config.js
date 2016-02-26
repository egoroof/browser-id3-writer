const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'browser-id3-writer': './src/browser-id3-writer.js',
        'browser-id3-writer.min': './src/browser-id3-writer.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: 'ID3Writer',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min.js$/
        })
    ]
};
