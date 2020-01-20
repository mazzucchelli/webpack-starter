const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const WebpackMonitor = require('webpack-monitor');
const ESLintPlugin = require('eslint-webpack-plugin');
const configs = require('./project.config.json');

const inputFileNames = () => {
    const cssInputs = configs.css.inputs || {};
    const jsInputs = configs.js.inputs || {};
    const assetsInputs = { __assets: './webpack.assets.js' };
    return { ...cssInputs, ...jsInputs, ...assetsInputs };
};

const undesiredFileNames = () => {
    const arr = ['__assets.js', '__assets.js.map'];
    const keys = Object.keys(configs.css.inputs);
    for (const key of keys) {
        arr.push(`${key}.js`, `${key}.js.map`);
    }
    return arr;
};

const plugins = [
    // prevent undesired .js files
    new IgnoreEmitPlugin(undesiredFileNames()),
    // clean outputs before first build
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false, // resolve conflict with `CopyWebpackPlugin`
    }),
    // generate sprite
    new SpriteLoaderPlugin({
        plainSprite: true,
    }),
    // extract styles
    new MiniCssExtractPlugin({
        filename: 'css/[name].css',
    }),
    // copy font files
    new CopyPlugin([
        {
            from: path.resolve(`./src/fonts`),
            to: path.resolve(`./dist/css/fonts`),
        },
    ]),
    // lint styles
    new StylelintPlugin({
        formatter: 'verbose',
    }),
    // lint js
    new ESLintPlugin({
        formatter: 'stylish',
    }),
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

module.exports = {
    mode: 'development',
    entry: inputFileNames(),
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
