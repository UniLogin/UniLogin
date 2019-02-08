const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const waitToBeMined = async (provider, transactionHash, tick = 1000) => {
  let receipt = await provider.getTransactionReceipt(transactionHash);
  while (!receipt || !receipt.blockNumber) {
    await sleep(tick);
    receipt = await provider.getTransactionReceipt(transactionHash);
  }
  return receipt;
};

const waitUntil = async (predicate, tick = 5, timeout = 1000, args = []) => {
  let elapsed = 0;
  while (!await predicate(...args)) {
    if (elapsed > timeout) {
      throw Error('Timeout');
    }
    await sleep(tick);
    elapsed += tick;
  }
  return true;
};

export {sleep, waitToBeMined, waitUntil};
