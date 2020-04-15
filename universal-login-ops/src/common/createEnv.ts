interface CreateEnvProps {
  jsonRpcUrl: string;
  daiTokenAddress: string;
  saiTokenAddress: string;
  ensAddress: string;
  ensDomains: string[];
  walletContractAddress: string;
};

const createEnv = ({jsonRpcUrl, daiTokenAddress, saiTokenAddress, ensAddress, ensDomains, walletContractAddress}: CreateEnvProps) => {
  const env: any = {
    ENS_ADDRESS: ensAddress,
    JSON_RPC_URL: jsonRpcUrl,
    TOKENS: [daiTokenAddress, saiTokenAddress].join(','),
    SAI_TOKEN_ADDRESS: saiTokenAddress,
    RELAYER_URL: 'http://localhost:3311',
    WALLET_MASTER_ADDRESS: walletContractAddress,
    ENS_DOMAINS: ensDomains.join(','),
  };
  return env;
};

export default createEnv;
