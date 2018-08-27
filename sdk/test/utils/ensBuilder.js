import chai from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import {providers} from 'ethers';
import ENSBuilder from '../../lib/utils/ensBuilder';

const {expect} = chai;

describe('ENS Builder', async () => {
  let wallet;
  let deployer;
  let provider;

  before(async () => {
    provider = createMockProvider();
    [wallet, deployer] = await getWallets(provider);
  });

  it('bootstrap and register name', async () => {
    const builder = new ENSBuilder(deployer);
    const expectedAddress = wallet.address;
    await builder.bootstrapENS();
    await builder.registerTLD('eth');
    await builder.registerDomain('mylogin', 'eth');
    await builder.registerAddress('alex', 'mylogin.eth', expectedAddress);

    const chainOptions = {
      chainId: 0,
      ensAddress: builder.ens.address
    };
    // eslint-disable-next-line no-underscore-dangle
    const providerWithEns = new providers.Web3Provider(provider._web3Provider, chainOptions);
    expect(await providerWithEns.resolveName('alex.mylogin.eth')).to.eq(expectedAddress);
  });
});
