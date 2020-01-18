function requireAll(r) {
    r.keys().forEach(r);
}

// TODO: path as parameter
requireAll(require.context("./src/svg/", true, /\.svg$/));
requireAll(require.context("./src/images/", true, /\.png$/));
// requireAll(require.context("../fonts/", true, /\.woff$/));
