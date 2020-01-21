const requireAll = r => r.keys().forEach(r);
requireAll(require.context('./src/svg/', true, /\.svg$/));
// requireAll(require.context('./src/images/', true, /\.(png|jpg|gif)$/));

// import svgSymbolSpriteLoader from 'svg-symbol-sprite-loader';

// Call the sprite loader to fetch and cache the latest SVG sprite.
// svgSymbolSpriteLoader({ useCache: process.env.NODE_ENV === 'production' });

// import iconOne from './src/svg/arror-bottom.svg';

// // ...
// export default () => `
//   <svg>
//     <use href=#${iconOne.id}>
//   </svg>
// `;
