var path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'jslib',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: 'babel-loader'
            }
        ]
    }
};
