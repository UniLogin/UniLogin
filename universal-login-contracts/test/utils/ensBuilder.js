import {expect} from 'chai';
import {createMockProvider, getWallets} from 'ethereum-waffle';
import ENSBuilder from '../../lib/utils/ensBuilder';
import {withENS, lookupAddress} from '../../lib/utils/utils';

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
    await builder.bootstrap();
    await builder.registerTLD('eth');
    await builder.registerReverseRegistrar();
    await builder.registerDomain('mylogin', 'eth');
    await builder.registerAddress('alex', 'mylogin.eth', expectedAddress);
    const providerWithEns = withENS(provider, builder.ens.address);
    expect(await providerWithEns.resolveName('alex.mylogin.eth')).to.eq(expectedAddress);

    const reverseRegistrar = builder.registrars['addr.reverse'];
    await reverseRegistrar.setName('alex.mylogin.eth');

    const {address} = builder.deployer;
    expect(await lookupAddress(providerWithEns, address)).to.eq('alex.mylogin.eth');
  });
});
