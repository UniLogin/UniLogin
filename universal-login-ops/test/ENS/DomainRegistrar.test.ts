import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {utils, Contract, Wallet} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {basicENS} from '@unilogin/commons/testutils';
import DomainRegistrar from '../../src/ENS/DomainRegistrar';
import ENSNameRegistrar from '../../src/ENS/ENSNameRegistrar';
import {ens} from '@unilogin/contracts';

chai.use(require('chai-string'));
chai.use(sinonChai);

const nullConsole = () => {};

describe('ENS register', () => {
  let wallet: Wallet;
  let ensAddress: string;
  let ensRegistrars: string[];
  let publicResolver: string;
  let label: string;
  let node: string;
  let labelHash: string;
  const transactionOverrides = {gasPrice: utils.bigNumberify(100)};

  before(async () => {
    ({wallet, ensAddress, ensRegistrars, publicResolver} = await loadFixture(basicENS));
  });

  describe('DomainRegistrar', () => {
    let domainRegistrar: DomainRegistrar;
    const tld = 'eth';

    before(() => {
      domainRegistrar = new DomainRegistrar({ensAddress, publicResolverAddress: publicResolver}, wallet, transactionOverrides, nullConsole);
      label = 'unilogin';
      labelHash = utils.keccak256(utils.toUtf8Bytes(label));
      node = utils.namehash(`${label}.${tld}`);
    });

    it('Should register label to register', async () => {
      await domainRegistrar.registerInRegistrar(label, labelHash, node, tld);
      expect(await domainRegistrar.ens.owner(node)).to.eq(wallet.address);
    });

    it('Should set resolver', async () => {
      await domainRegistrar.setAsResolverPublicResolver(label, node, tld);
      expect(await domainRegistrar.ens.resolver(node)).to.eq(publicResolver);
    });

    it('should set new registrar as domain owner', async () => {
      const registrarAddress = await domainRegistrar.deployNewRegistrar(node);
      await domainRegistrar.setRegistrarAsOwner(label, node, tld);
      expect(await domainRegistrar.ens.owner(node)).to.eq(registrarAddress);
    });

    it('register existing domain', async () => {
      const label = 'super-app';
      const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
      const node = utils.namehash(`${label}.${tld}`);
      await domainRegistrar.registerInRegistrar(label, labelHash, node, tld);
      const {publicResolverAddress} = await domainRegistrar.registerEthDomain(label);
      expect(await domainRegistrar.ens.owner(node)).to.eq(domainRegistrar.registrarAddress);
      expect(await domainRegistrar.ens.resolver(node)).to.not.eq(publicResolver);
      expect(await domainRegistrar.ens.resolver(node)).to.eq(publicResolverAddress);
    });

    describe('start works', () => {
      it('should register new domain', async () => {
        const label = 'my-domain';
        const tld = 'eth';
        const node = utils.namehash(`${label}.${tld}`);
        await domainRegistrar.start(label, tld);
        expect(await domainRegistrar.ens.owner(node)).to.eq(domainRegistrar.registrarAddress);
        expect(await domainRegistrar.ens.resolver(node)).to.eq(publicResolver);
      });
    });
  });

  describe('ENS Address registrar', async () => {
    let nameRegistrar: ENSNameRegistrar;
    let domain: string;
    let publicResolverContract: Contract;

    before(async () => {
      nameRegistrar = new ENSNameRegistrar({ensAddress, publicResolverAddress: publicResolver}, wallet, {}, nullConsole);
      label = 'justyna';
      labelHash = utils.keccak256(utils.toUtf8Bytes(label));
      [domain] = ensRegistrars;
      node = utils.namehash(`${label}.${domain}`);
      publicResolverContract = new Contract(publicResolver, ens.PublicResolver.interface, wallet);
      await nameRegistrar.prepareNameRegistration(domain);
    });

    it('should register name', async () => {
      await nameRegistrar.registerName(labelHash, label, domain, node);
      expect(await nameRegistrar.ens.owner(node)).to.eq(wallet.address);
    });

    it('should set resolver', async () => {
      await nameRegistrar.setResolver(node, label, domain);
      expect(await nameRegistrar.ens.resolver(node)).to.eq(publicResolver);
    });

    it('should set address', async () => {
      await nameRegistrar.setAddress(node, label, domain);
      expect(await publicResolverContract.addr(node)).to.eq(wallet.address);
    });

    it('should set name', async () => {
      const reverseNode = utils.namehash(`${wallet.address.slice(2)}.addr.reverse`);
      await nameRegistrar.setReverseName(label, domain);
      expect(await publicResolverContract.name(reverseNode)).to.eq(`${label}.${domain}`);
    });

    it('start works', async () => {
      const reverseNode = utils.namehash(`${wallet.address.slice(2)}.addr.reverse`);
      await nameRegistrar.start('justa', domain);
      expect(await publicResolverContract.addr(utils.namehash(`justa.${domain}`))).to.eq(wallet.address);
      expect(await publicResolverContract.name(reverseNode)).to.eq(`justa.${domain}`);
    });
  });
});
