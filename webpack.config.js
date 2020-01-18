const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const IgnoreEmitPlugin = require("ignore-emit-webpack-plugin");

const jsCompiler = {
    mode: "development",
    entry: {
        app: "./src/js/index.js",
        sprite: "./src/js/sprite.js"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist/js/")
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ["svg-sprite-loader", "svgo-loader"]
            }
        ]
    },
    devtool: "source-map",
    plugins: [new CleanWebpackPlugin()]
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

module.exports = [jsCompiler, cssCompiler];
