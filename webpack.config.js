const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");

const jsCompiler = {
    mode: "development",
    entry: {
        app: "./src/js/index.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/js/")
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
                options: {
                    outputReport: {
                        filePath: "jslint_report.json",
                        formatter: "json"
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new StatsWriterPlugin({
            filename: "stats.json",
            stats: {
                all: true
            }
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
        new IgnoreEmitPlugin([/\.js$/, /\.js.map$/]), // prevent undesired .js files
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css"
        }),
        new CopyPlugin([
            {
                from: path.resolve(`./src/fonts`),
                to: path.resolve(`./dist/css/fonts`)
            }
        ]),
        new StatsWriterPlugin({
            filename: "stats.json",
            stats: {
                all: false,
                assets: true
            }
        }),
        new StylelintPlugin({
            // formatter: function formatter(results, returnValue) {
            //     console.log(results, returnValue);
            // }
        })
    ]
};

const assetsCompiler = {
    mode: "development",
    entry: {
        __assets: "./webpack.assets.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/assets/")
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
                            spriteFilename: "icons/sprite.svg",
                            runtimeCompat: true
                        }
                    },
                    { loader: "svgo-loader" }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: "images/[name].[ext]",
                            limit: 50000,
                            quality: 85
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new IgnoreEmitPlugin(["__assets.js", "__assets.js.map"]), // prevent undesired .js files
        new SpriteLoaderPlugin({
            plainSprite: true
        }),
        new StatsWriterPlugin({
            filename: "stats.json",
            stats: {
                all: true
            }
        })
    ]
};

module.exports = [jsCompiler, cssCompiler, assetsCompiler];
