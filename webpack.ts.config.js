const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { StatsWriterPlugin } = require('webpack-stats-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');

const tsCompiler = {
    mode: 'development',
    entry: { app: './src/ts/index.ts' },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/js'),
    },
    plugins: [
        new CleanWebpackPlugin(),
        new StatsWriterPlugin({
            filename: 'stats.json',
            stats: {
                all: true,
            },
        }),
        new ProgressBarPlugin({
            format: 'TS build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: false,
        }),
    ],
};

const cssCompiler = {
    mode: 'development',
    entry: {
        global: './src/scss/global.scss',
        home_page: './src/scss/home_page.scss',
    },
    output: {
        path: path.resolve(__dirname, 'dist/css/'),
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new IgnoreEmitPlugin([/\.js$/, /\.js.map$/]), // prevent undesired .js files
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new CopyPlugin([
            {
                from: path.resolve(`./src/fonts`),
                to: path.resolve(`./dist/css/fonts`),
            },
        ]),
        new StatsWriterPlugin({
            filename: 'stats.json',
            stats: {
                all: false,
                assets: true,
            },
        }),
        new StylelintPlugin({
            // formatter: function formatter(results, returnValue) {
            //     console.log(results, returnValue);
            // }
        }),
        new ProgressBarPlugin({
            format: 'CSS build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: false,
        }),
    ],
};

const assetsCompiler = {
    mode: 'development',
    entry: {
        __assets: './webpack.assets.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/assets/'),
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'icons/sprite.svg',
                            runtimeCompat: true,
                        },
                    },
                    { loader: 'svgo-loader' },
                ],
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: 'images/[name].[ext]',
                            limit: 50000,
                            quality: 85,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new IgnoreEmitPlugin(['__assets.js', '__assets.js.map']), // prevent undesired .js files
        new SpriteLoaderPlugin({
            plainSprite: true,
        }),
        new StatsWriterPlugin({
            filename: 'stats.json',
            stats: {
                all: true,
            },
        }),
        new ProgressBarPlugin({
            format: 'ASSETS build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            clear: false,
        }),
    ],
};

module.exports = [tsCompiler, cssCompiler, assetsCompiler];
