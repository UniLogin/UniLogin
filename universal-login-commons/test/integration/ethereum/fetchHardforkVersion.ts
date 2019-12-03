import {expect} from 'chai';
import {providers} from 'ethers';
import {fetchHardforkVersion, ISTANBUL_BLOCK_NUMBER} from '../../../lib/integration/ethereum/fetchHardforkVersion';
import {mockProviderWithBlockNumber} from '../../helpers/mockProvider';

describe('fetchHardforkVersion', async () => {
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


  it('throws exception', async () =>  {
    const provider = mockProviderWithBlockNumber('', 1);
    await expect(fetchHardforkVersion(provider as providers.Provider)).to.eventually.be.rejectedWith('Invalid network');
  })
});
