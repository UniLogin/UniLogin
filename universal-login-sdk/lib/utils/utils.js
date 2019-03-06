const waitForTransactionReceipt = async (providerOrWallet, transactionHash, tick = 1000) => {
  const provider = providerOrWallet.provider ? providerOrWallet.provider : providerOrWallet;
  return provider.waitForTransaction(transactionHash);
};

export {waitForTransactionReceipt};
