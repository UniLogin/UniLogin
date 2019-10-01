import {ensure} from '@universal-login/commons';

export const getEtherscanUrl = (chainName: string, transactionHash: string) : string => {
  ensure(chainName.length !== 0, Error, 'Invalid chain name');
  if (transactionHash.length === 0) {
    return transactionHash;
  }
  const protocolPrefix = 'https://';
  const explorerUrl = 'etherscan.io/tx/';
  const canonicalChainName = chainName.toLowerCase().trim();
  const baseName = canonicalChainName  === 'mainnet' ? explorerUrl : `${canonicalChainName}.${explorerUrl}`;
  return `${protocolPrefix}${baseName}${transactionHash}`;
};
