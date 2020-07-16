import {expect} from 'chai';
import {providers} from 'ethers';
import {ProviderService} from '../../../src/integration/ethereum/ProviderService';
import {mockProviderWithBlockNumber} from '../../helpers/mockProvider';
import {fetchHardforkVersion, ISTANBUL_BLOCK_NUMBER} from '../../../src/integration/ethereum/fetchHardforkVersion';

describe('fetchHardforkVersion', () => {
  const itReturnsHardforkVersion = (network: string, hardfork: string, blockNumber?: number) =>
    it(`returns ${hardfork} for ${network} ${blockNumber && `for block number equals ${blockNumber}`}`, async () => {
      const provider = mockProviderWithBlockNumber(network, blockNumber || 0);
      expect(await fetchHardforkVersion(provider as providers.Provider)).to.eq(hardfork);
    });

  itReturnsHardforkVersion('kovan', 'istanbul');
  itReturnsHardforkVersion('rinkeby', 'istanbul');
  itReturnsHardforkVersion('ropsten', 'istanbul');
  itReturnsHardforkVersion('homestead', 'constantinople', 1000);
  itReturnsHardforkVersion('homestead', 'constantinople', ISTANBUL_BLOCK_NUMBER - 1);
  itReturnsHardforkVersion('homestead', 'istanbul', ISTANBUL_BLOCK_NUMBER);
  itReturnsHardforkVersion('homestead', 'istanbul', ISTANBUL_BLOCK_NUMBER + 1);
  itReturnsHardforkVersion('mainnet', 'constantinople', 1000);
  itReturnsHardforkVersion('mainnet', 'constantinople', ISTANBUL_BLOCK_NUMBER - 1);
  itReturnsHardforkVersion('mainnet', 'istanbul', ISTANBUL_BLOCK_NUMBER);
  itReturnsHardforkVersion('mainnet', 'istanbul', ISTANBUL_BLOCK_NUMBER + 1);

  it('throws exception', async () => {
    const provider = mockProviderWithBlockNumber('', 1);
    const providerService = new ProviderService(provider as providers.JsonRpcProvider);
    await expect(providerService.fetchHardforkVersion()).to.eventually.be.rejectedWith('Invalid network');
  });
});
