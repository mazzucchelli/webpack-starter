const requireAll = r => r.keys().forEach(r);
requireAll(require.context('./src/svg/', true, /\.svg$/));
requireAll(require.context('./src/images/', true, /\.(png|jpg|gif)$/));
