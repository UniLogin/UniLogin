export const getEtherscanUrl = (chainName: string, transactionHash: string) => {
  const protocolPrefix = 'https://';
  const explorerUrl = 'etherscan.io/tx/';
  const canonicalChainName = chainName.toLowerCase().trim();
  const baseName = canonicalChainName  === 'mainnet' ? explorerUrl : `${canonicalChainName}.${explorerUrl}`;
  return `${protocolPrefix}${baseName}${transactionHash}`;
};

