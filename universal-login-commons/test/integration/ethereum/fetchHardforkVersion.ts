import {expect} from 'chai';
import {providers} from 'ethers';
import {fetchHardforkVersion, ISTANBUL_BLOCK_NUMBER} from '../../../lib/integration/ethereum/fetchHardforkVersion';

describe('fetchHardforkVersion', async () => {
  const itReturnsHardforkVersion = (network: string, hardfork: string, blockNumber?: number) =>
    it(`returns ${hardfork} for ${network} ${blockNumber && `for block number equals ${blockNumber}`}`, async () => {
      const provider = blockNumber ? mockProviderWithBlockNumber(blockNumber) : {};
      expect(await fetchHardforkVersion(network, provider as providers.Provider)).to.eq(hardfork);
    });

  const mockProviderWithBlockNumber = (blockNumber: number) =>
    ({getBlockNumber: () => new Promise(resolve => resolve(blockNumber))});

  itReturnsHardforkVersion('kovan', 'istanbul');
  itReturnsHardforkVersion('rinkeby', 'istanbul');
  itReturnsHardforkVersion('ropsten', 'istanbul');
  itReturnsHardforkVersion('mainnet', 'constantinople', 1000);
  itReturnsHardforkVersion('mainnet', 'constantinople', ISTANBUL_BLOCK_NUMBER - 1);
  itReturnsHardforkVersion('mainnet', 'istanbul', ISTANBUL_BLOCK_NUMBER);
  itReturnsHardforkVersion('mainnet', 'istanbul', ISTANBUL_BLOCK_NUMBER + 1);

  it('throws error for mainnet when provider is missing', async () => {
    await expect(fetchHardforkVersion('mainnet')).to.be.eventually.rejectedWith('Provider is missing');
  });
});
