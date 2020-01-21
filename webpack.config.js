const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const WebpackMonitor = require('webpack-monitor');
const ESLintPlugin = require('eslint-webpack-plugin');
const configs = require('./project.config.json');
// const ImageminPlugin = require('imagemin-webpack')
const ImageminPlugin = require('imagemin-webpack-plugin').default;
// const SVGSymbolSprite = require('svg-symbol-sprite-loader');
// const IconfontWebpackPlugin = require('iconfont-webpack-plugin');

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
        // copy fonts
        {
            from: 'src/fonts',
            to: 'css/fonts',
        },
        // min images
        {
            from: 'src/images/',
            to: 'assets',
        },
    ]),
    new ImageminPlugin({
        cacheFolder: path.resolve('node_modules/cache-imgmin/'),
        externalImages: {
            context: 'src', // Important! This tells the plugin where to "base" the paths at
            sources: glob.sync('src/images/**/*'),
            destination: 'dist/assets',
            fileName: '[name].[ext]', // (filePath) => filePath.replace('jpg', 'webp') is also possible
        },
        plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
        ],
    }),
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
            capture: true,
            target: './myStatsStore.json',
            launch: true,
            port: 3030,
            excludeSourceMaps: true,
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
                            // plugins: loader => [
                            //     // Add the plugin
                            //     new IconfontWebpackPlugin({
                            //         resolve: loader.resolve,
                            //         fontNamePrefix: 'custom-',
                            //         enforcedSvgHeight: 3000,
                            //         modules: false,
                            //     }),
                            // ],
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
                            spriteFilename: 'assets/sprite.svg',
                            runtimeCompat: true,
                        },
                    },
                    { loader: 'svgo-loader' },
                ],
            },
        ],
    },
    plugins: plugins,
};
