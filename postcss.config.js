module.exports = {
    plugins: {
        "postcss-cssnext": {
            browsers: ["last 2 versions", "> 5%"]
        },
        "css-mqpacker": {},
        cssnano: {
            preset: "default"
        }
    }
};
