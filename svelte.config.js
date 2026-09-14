import adapter from '@sveltejs/adapter-static';

const config = {
  kit: {
    paths: {
      base: '/devkota-lab-v2'
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: true,
      strict: true
    })
  }
};

export default config;
