// var path = require('path')
module.exports = {
    entry: {
        bundle: __dirname + '/src/main.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015']
            },

        }]
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: __dirname,
        historyApiFallback: true,
        hot: false,
        inline: true,
    }
}