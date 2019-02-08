require('dotenv').config();

module.exports = Object.freeze({
  jsonRpcUrl: process.env.JSON_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  chainSpec: {
    ensAddress: process.env.ENS_ADDRESS,
    publicResolverAddress: process.env.PUBLIC_RESOLVER_ADDRESS,
    chainId: 0,
  },
});
