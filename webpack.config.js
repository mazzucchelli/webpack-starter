const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
// const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');

const jsCompiler = {
    mode: "development",
    entry: {
        app: "./src/js/index.js",
        sprite: "./src/js/__sprite.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/js/")
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "svg-sprite-loader",
                        options: {
                            extract: true,
                            spriteFilename: "../assets/sprite.svg",
                            runtimeCompat: true
                        }
                    },
                    { loader: "svgo-loader" }
                ]
            }
        ]
    },
    devtool: "source-map",
    plugins: [
        new IgnoreEmitPlugin(['sprite.js', 'sprite.js.map']), // CleanWebpackPlugin will generates undesired .js files
        new CleanWebpackPlugin(),
        new SpriteLoaderPlugin({
            plainSprite: true
        })
    ]
};

const cssCompiler = {
    mode: "development",
    entry: {
        global: "./src/scss/global.scss",
        home_page: "./src/scss/home_page.scss"
    },
    output: {
        path: path.resolve(__dirname, "dist/css/")
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new IgnoreEmitPlugin([/\.js$/, /\.js.map$/]), // CleanWebpackPlugin will generates undesired .js files
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ]
};

// const svgCompiler = {
//     mode: "development",
//     entry: path.resolve(__dirname, "src"),
//     output: {
//         path: path.resolve(__dirname, "dist/assets/")
//     },
//     plugins: [new SVGSpritemapPlugin('src/svg/*.svg')]
// };

module.exports = [jsCompiler, cssCompiler];
