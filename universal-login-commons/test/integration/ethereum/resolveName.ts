import {expect} from 'chai';
import {loadFixture, getWallets} from 'ethereum-waffle';
import {basicENS} from '../../fixtures/basicENS';
import {utils, providers} from 'ethers';
import {resolveName, createKeyPair} from '../../../lib';
import {registerName, setResolver, setAddress} from '../../../lib/integration/ethereum/ens';

describe('INT: resolveName', () => {
  let provider: providers.JsonRpcProvider;
  let ensAddress: string;
  let publicResolver: string;
  let registrarAddress: string;
  let ensBuilder: any;

  beforeEach(async () => {
    ({provider, ensAddress, ensBuilder, publicResolver, registrarAddress} = await loadFixture(basicENS));
  });

  it('null if ensName is not registered', async () => {
    expect(await resolveName(provider, ensAddress, 'not-existing.mylogin.eth')).to.be.null;
  });

  it('successfully resolved', async () => {
    const keyPair = createKeyPair();
    await ensBuilder.registerAddress('alex', 'mylogin.eth', keyPair.publicKey);
    expect(await resolveName(provider, ensAddress, 'alex.mylogin.eth')).to.be.eq(keyPair.publicKey);
  });

  it('null if resolver is not resolved', async () => {
    const [newWallet] = getWallets(provider);
    const name = 'name';
    const ensName = `${name}.mylogin.eth`;
    const node = utils.namehash(ensName);

    await registerName(name, newWallet, registrarAddress);
    expect(await resolveName(provider, ensAddress, ensName)).to.be.null;

    await setResolver(node, newWallet, ensAddress, publicResolver);
    expect(await resolveName(provider, ensAddress, ensName)).to.be.null;

    await setAddress(node, newWallet, publicResolver);
    expect(await resolveName(provider, ensAddress, ensName)).to.eq(newWallet.address);
  });
});
