const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/browser-id3-writer.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'browser-id3-writer.min.js',
        library: 'ID3Writer',
        libraryTarget: 'umd',
        umdNamedDefine: true
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
        new webpack.optimize.UglifyJsPlugin()
    ]
};
