const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyPlugin = require('copy-webpack-plugin');
// const { StatsWriterPlugin } = require('webpack-stats-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
const WebpackMonitor = require('webpack-monitor');
const chalk = require('chalk');
const ESLintPlugin = require('eslint-webpack-plugin');
// const WebpackHookPlugin = require('webpack-hook-plugin');

const plugins = [
    new IgnoreEmitPlugin([
        '__assets.js',
        '__assets.js.map',
        'global.js',
        'global.js.map',
        'home_page.js',
        'home_page.js.map',
    ]), // prevent undesired .js files
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false, // resolve conflict with `CopyWebpackPlugin`
    }),
    new SpriteLoaderPlugin({
        plainSprite: true,
    }),
    new MiniCssExtractPlugin({
        filename: 'css/[name].css',
    }),
    new CopyPlugin([
        {
            from: path.resolve(`./src/fonts`),
            to: path.resolve(`./dist/css/fonts`),
        },
    ]),
    new StylelintPlugin({
        formatter: 'verbose',
    }),
    new ESLintPlugin({
        formatter: 'stylish',
    }),
    new ProgressBarPlugin({
        format: 'Build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: false,
        width: 20,
    }),
    // new WebpackHookPlugin({
    //     onBuildStart: ['echo "Webpack Start"'],
    //     onBuildEnd: ['echo "Webpack End"'],
    // }),
];

if (process.argv.includes('--monitor')) {
    plugins.push(
        new WebpackMonitor({
            capture: true, // -> default 'true'
            target: './myStatsStore.json', // default -> '../monitor/stats.json'
            launch: true, // -> default 'false'
            port: 3030, // default -> 8081
            excludeSourceMaps: true, // default 'true'
        }),
    );
}

const jsCompiler = {
    mode: 'development',
    entry: {
        __assets: './webpack.assets.js',
        app: './src/js/index.js',
        global: './src/scss/global.scss',
        home_page: './src/scss/home_page.scss',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist/'),
    },
    devtool: 'source-map',
    stats: { children: false },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    outputReport: {
                        filePath: 'jslint_report.json',
                        formatter: 'json',
                    },
                },
            },
            {
                test: /\.(s*)css$/,
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
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'assets/icons/sprite.svg',
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
                            name: 'assets/images/[name].[ext]',
                            limit: 50000,
                            quality: 85,
                        },
                    },
                ],
            },
        ],
    },
    plugins: plugins,
};

// const cssCompiler = {
//     mode: 'development',
//     entry: {
//         global: './src/scss/global.scss',
//         home_page: './src/scss/home_page.scss',
//     },
//     output: {
//         path: path.resolve(__dirname, 'dist/css/'),
//     },
//     devtool: 'source-map',
//     module: {
//         rules: [
//             {
//                 test: /\.scss$/,
//                 use: [
//                     {
//                         loader: MiniCssExtractPlugin.loader,
//                     },
//                     {
//                         loader: 'css-loader',
//                         options: {
//                             url: false,
//                             sourceMap: true,
//                         },
//                     },
//                     {
//                         loader: 'postcss-loader',
//                         options: {
//                             sourceMap: true,
//                         },
//                     },
//                     {
//                         loader: 'sass-loader',
//                         options: {
//                             sourceMap: true,
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
//     plugins: [
//         new IgnoreEmitPlugin([/\.js$/, /\.js.map$/]), // prevent undesired .js files
//         new CleanWebpackPlugin(),
//         new MiniCssExtractPlugin({
//             filename: '[name].css',
//         }),
//         new CopyPlugin([
//             {
//                 from: path.resolve(`./src/fonts`),
//                 to: path.resolve(`./dist/css/fonts`),
//             },
//         ]),
//         new StatsWriterPlugin({
//             filename: 'stats.json',
//             stats: {
//                 all: false,
//                 assets: true,
//             },
//         }),
//         new StylelintPlugin({
//             // formatter: function formatter(results, returnValue) {
//             //     console.log(results, returnValue);
//             // }
//         }),
//         new ProgressBarPlugin({
//             format: 'CSS build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
//             clear: false,
//         }),
//     ],
// };

// const assetsCompiler = {
//     mode: 'development',
//     entry: {},
//     output: {
//         filename: '[name].js',
//         path: path.resolve(__dirname, 'dist/assets/'),
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.svg$/,
//                 use: [
//                     {
//                         loader: 'svg-sprite-loader',
//                         options: {
//                             extract: true,
//                             spriteFilename: 'icons/sprite.svg',
//                             runtimeCompat: true,
//                         },
//                     },
//                     { loader: 'svgo-loader' },
//                 ],
//             },
//             {
//                 test: /\.(png|jpg|gif)$/i,
//                 use: [
//                     {
//                         loader: 'url-loader',
//                         options: {
//                             name: 'images/[name].[ext]',
//                             limit: 50000,
//                             quality: 85,
//                         },
//                     },
//                 ],
//             },
//         ],
//     },
//     plugins: [
//         new IgnoreEmitPlugin(['__assets.js', '__assets.js.map']), // prevent undesired .js files
//         new SpriteLoaderPlugin({
//             plainSprite: true,
//         }),
//         new StatsWriterPlugin({
//             filename: 'stats.json',
//             stats: {
//                 all: true,
//             },
//         }),
//         new ProgressBarPlugin({
//             format: 'ASSETS build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
//             clear: false,
//         }),
//     ],
// };

module.exports = [jsCompiler];
