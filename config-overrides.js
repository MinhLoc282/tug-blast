const webpack = require('webpack');
const { useBabelRc, override } = require('customize-cra');

module.exports = override(
  useBabelRc(),
  (config) => {
    // Add babel-loader rule specifically for ConstantsUtil.js in scaffold-utils
    config.module.rules.push({
      test: /\.js$/, // Adjust the test pattern if necessary
      include: /node_modules[\\/]@web3modal[\\/]scaffold-utils/, // Target the scaffold-utils module
      use: {
        loader: require.resolve('babel-loader'), // Use babel-loader directly
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: [
            ['@babel/plugin-syntax-import-attributes', { deprecatedAssertSyntax: true }]
          ]
        }
      }
    });

    // Add webpack plugin for resolving certain modules in Node.js environment
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

    // Add webpack plugin for providing global variables
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    );

    return config;
  }
);
