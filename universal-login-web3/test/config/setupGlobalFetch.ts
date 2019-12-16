export const setupGlobalFetch = () => {
  (global as any).fetch = require('node-fetch');
};
