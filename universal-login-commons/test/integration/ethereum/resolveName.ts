import {expect} from 'chai';
import {loadFixture, getWallets} from 'ethereum-waffle';
import {basicENS} from '../../fixtures/basicENS';
import {Wallet, utils, Contract, providers} from 'ethers';
import RegistrarContract from '../../contracts/FIFSRegistrar.json';
import ENS from '../../../lib/contracts/ENS.json';
import PublicResolver from '../../../lib/contracts/PublicResolver.json';
import {resolveName, createKeyPair} from '../../../lib';

describe('INT: resolveName', () => {
  let provider: providers.JsonRpcProvider;
  let ensAddress: string;
  let publicResolver: string;
  let registrarAddress: string;
  let ensBuilder: any;

  beforeEach(async () => {
    ({provider, ensAddress, ensBuilder, publicResolver, registrarAddress} = await loadFixture(basicENS));
  });

  it('false if ensName is not registered', async () => {
    expect(await resolveName(provider, ensAddress, 'not-existing.mylogin.eth')).to.be.false;
  });

  it('successfully resolved', async () => {
    const keyPair = createKeyPair();
    await ensBuilder.registerAddress('alex', 'mylogin.eth', keyPair.publicKey);
    expect(await resolveName(provider, ensAddress, 'alex.mylogin.eth')).to.be.eq(keyPair.publicKey);
  });

  it('false if resolver is not resolved', async () => {
    const [newWallet] = getWallets(provider);
    const name = 'name';
    const ensName = `${name}.mylogin.eth`;
    const node = utils.namehash(ensName);

    await registerName(name, newWallet, registrarAddress);
    expect(await resolveName(provider, ensAddress, ensName)).to.be.false;

    await setResolver(node, newWallet, ensAddress, publicResolver);
    expect(await resolveName(provider, ensAddress, ensName)).to.be.false;

    await setAddress(node, newWallet, publicResolver);
    expect(await resolveName(provider, ensAddress, ensName)).to.eq(newWallet.address);
  });
});

const registerName = (name: string, wallet: Wallet, registrarAddress: string) => {
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(name));
  const registrar = new Contract(registrarAddress, RegistrarContract.interface, wallet);
  return registrar.register(hashLabel, wallet.address);
};

const setResolver = (node: string, wallet: Wallet, ensAddress: string, publicResolver: string) => {
  const ens = new Contract(ensAddress, ENS.interface as any, wallet);
  return ens.setResolver(node, publicResolver);
};

const setAddress = (node: string, wallet: Wallet, publicResolver: string) => {
  const publicResolverContract = new Contract(publicResolver, PublicResolver.interface as any, wallet);
  return publicResolverContract.setAddr(node, wallet.address);
};
