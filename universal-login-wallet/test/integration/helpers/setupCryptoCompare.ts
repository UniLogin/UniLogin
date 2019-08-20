export const setupCryptoCompare = () => {
  (global as any).fetch = require('node-fetch');
};
