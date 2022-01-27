const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}
const port = process.env.port || process.env.npm_config_port || 9520; // dev port

module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  'publicPath': process.env.NODE_ENV === 'development' ? './' : './',
  'lintOnSave': false,
  'outputDir': '../axios_demo/pack_demo',
  'assetsDir': 'static',
  'indexPath': 'index.html',
  'productionSourceMap': false,
  'devServer': {
    'port': port,
    'open': true,
    'overlay': {
      'warnings': false,
      'errors': true
    }
    // proxy: {
    //   '/api': {
    //     target: 'https://project.moja.vip',
    //     changeOrigin: true,
    //     ws: true,
    //     pathRewrite: { '^/api': '' }
    //   },
    //   '/m': {
    //     target: 'http://testlocal.wmnetwork.cc',
    //     changeOrigin: true,
    //     pathRewrite: {'^/m': ''}
    //   }
    // }
    // proxy: 'http://testlocal.wmnetwork.cc'
  },
  'configureWebpack': {
    'resolve': {
      'alias': {
        '@': resolve('src')
      }
    }
  },
  'chainWebpack': config => {
    // GraphQL Loader
    config.module
      .rule('worker-loader')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end();
  },
  'css': {
    'extract': true,
    'sourceMap': false,
    'loaderOptions': {
      'scss': {
        // 在 sass-loader v8 中，这个选项名是 "prependData"
        'additionalData': '@import "~@/styles/variables.scss";'
      }
    }
  }
};
