interface CreateEnvProps {
  jsonRpcUrl: string;
  daiTokenAddress: string;
  saiTokenAddress: string;
  ensAddress: string;
  ensDomains: string[];
  jarvisRewardTokenAddress: string;
  walletContractAddress: string;
};

const createEnv = ({jsonRpcUrl, daiTokenAddress, saiTokenAddress, ensAddress, ensDomains, walletContractAddress}: CreateEnvProps) => {
  const env: any = {
    ENS_ADDRESS: ensAddress,
    JSON_RPC_URL: jsonRpcUrl,
    DAI_TOKEN_ADDRESS: daiTokenAddress,
    SAI_TOKEN_ADDRESS: saiTokenAddress,
    RELAYER_URL: 'http://localhost:3311',
    WALLET_MASTER_ADDRESS: walletContractAddress,
    JRT_TOKEN_ADDRESS: saiTokenAddress,
  };
  ensDomains.forEach((domain: string, index: number) => {
    env[`ENS_DOMAIN_${index + 1}`] = domain;
  });
  return env;
}

export default createEnv;
