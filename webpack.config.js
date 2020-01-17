const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.js',
        profile: './src/profile.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    }
}
