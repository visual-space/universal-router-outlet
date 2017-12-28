let webpack = require('webpack'),
    path = require('path'),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// Constants
const LIB_DIR = path.join(__dirname, '../lib'),
    SRC_DIR = path.join(__dirname, '../src'),
    NODE_MODULES_DIR = path.join(__dirname, '../node_modules')

module.exports = {

    entry: './src/universal-router-outlet.ts',

    output: {
        path: LIB_DIR,
        publicPath: '/',
        filename: 'universal-router-outlet.js',
		libraryTarget: 'commonjs2',
		library: 'UniversalRouterOutlet'
    },

    resolve: {
        extensions: ['*', '.ts', '.js']
    },

    module: {

        rules: [
            {
                test: /\.ts?$/,
                use: 'awesome-typescript-loader',
                include: SRC_DIR,
                exclude: /node_modules/
            }
        ]

    },

    plugins: [
      new UglifyJsPlugin()
    ],

    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    }
}