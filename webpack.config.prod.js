const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './app.prop.js',

    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'public'),
        publicPath: '/'
    },

    context: resolve(__dirname, 'js'),

    devtool: 'inline-source-map',

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                ],
                exclude: /node_modules/
            }
        ],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"'
            }
        })
    ],

    resolve: {
		extensions: ['.js', '.jsx']
	}

};