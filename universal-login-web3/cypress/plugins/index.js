const {providers, Wallet, utils} = require('ethers');
const webpack = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
  const options = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.tsx', '.js']
      },
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            loader: 'ts-loader',
            options: {transpileOnly: true}
          }
        ]
      }
    }
  };
  on('file:preprocessor', webpack(options));

  on('task', {
    topUpAccount(contractAddress) {
      const provider = new providers.JsonRpcProvider('http://localhost:18545');
      const wallet = new Wallet('0x29f3edee0ad3abf8e2699402e0e28cd6492c9be7eaab00d732a791c33552f797', provider);
      return wallet.sendTransaction({to: contractAddress, value: utils.parseEther('2.0')});
    }
  });
}