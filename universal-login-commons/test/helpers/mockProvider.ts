export const mockProviderWithBlockNumber = (name: string, blockNumber: number) =>
  ({
    getBlockNumber: () => new Promise(resolve => resolve(blockNumber)),
    getNetwork: () => new Promise(resolve => resolve({name})),
  });
