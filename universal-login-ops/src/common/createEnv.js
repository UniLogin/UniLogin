function createEnv({jsonRpcUrl, tokenAddress, ensAddress, ensDomains, walletMasterAddress}) {
  const env = {
    ENS_ADDRESS: ensAddress,
    JSON_RPC_URL: jsonRpcUrl,
    TOKEN_CONTRACT_ADDRESS: tokenAddress,
    RELAYER_URL: 'http://localhost:3311',
    WALLET_MASTER_ADDRESS: walletMasterAddress
  };
  ensDomains.forEach((domain, index) => {
    env[`ENS_DOMAIN_${index + 1}`] = domain;
  });
  return env;
}

module.exports = createEnv;
