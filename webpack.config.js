const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = [
    {
        mode: "development",
        entry: {
            app: "./src/index.js",
            profile: "./src/profile.js"
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "dist/js/")
        },
        devtool: "source-map",
        plugins: [
            new CleanWebpackPlugin()
        ]
    },
    {
        mode: "development",
        entry: {
            style: "./src/style.scss"
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
            // new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "css/[name].css"
            }),
        ]
    }
];
