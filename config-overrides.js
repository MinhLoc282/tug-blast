const path = require('path');
const webpack = require('webpack');

module.exports = function override(config) {
  const babelLoaderRule = config.module.rules.find(rule => rule.oneOf);

  // Add the '@babel/plugin-syntax-import-attributes' to the Babel configuration
  babelLoaderRule.oneOf.forEach(loader => {
    if (loader.loader && loader.loader.includes('babel-loader')) {
      // Ensure loader.options.plugins is initialized as an array
      loader.options.plugins = loader.options.plugins || [];
      // Push the plugin to the array
      loader.options.plugins.push('@babel/plugin-syntax-import-attributes');
    }
  });

  // config.resolve.alias['@web3modal/wagmi'] = path.resolve(__dirname, 'src/custom-web3modal-wagmi');

  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "assert": require.resolve("assert"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "os": require.resolve("os-browserify"),
    "url": require.resolve("url"),
    'process/browser': require.resolve('process/browser')
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);
  return config;
}
