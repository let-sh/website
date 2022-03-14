const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
module.exports = withPlugins(
  [
    [
      withImages,
      {
        /* config for next-optimized-images */
        fileExtensions: ['jpg', 'jpeg', 'png', 'svg', 'gif', 'ico', 'webp', 'jp2', 'avif'],
      },
    ],

    // your other plugins here
    [require('next-optimized-classnames')]
  ],
  {
    async rewrites() {
      return [
        // Rewrite everything else to use `pages/index`
        {
          source: '/console/:path*',
          destination: '/console/',
        },
      ];
    },
    img: {
      unoptimized: true,
    },
    images: {
      disableStaticImages: true
    },
    trailingSlash: true,
  }
);
