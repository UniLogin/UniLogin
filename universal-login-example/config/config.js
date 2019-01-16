module.exports = Object.freeze({
  jsonRpcUrl: process.env.JSON_RPC_URL,
  relayerUrl: process.env.RELAYER_URL,
  ensDomains: [process.env.ENS_DOMAIN_1, process.env.ENS_DOMAIN_2, process.env.ENS_DOMAIN_3],
  clickerContractAddress: process.env.CLICKER_CONTRACT_ADDRESS,
  tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS
});

