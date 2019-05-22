import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import {basicENS} from '@universal-login/commons/testutils';
import DomainRegistrar from '../../src/ENS/DomainRegistrar';
import ENSNameRegistrar from '../../src/ENS/ENSNameRegistrar';
import {utils, Contract} from 'ethers';
import PublicResolver from '@universal-login/contracts/build/PublicResolver';
import sinon from 'sinon';
import {loadFixture} from 'ethereum-waffle';


chai.use(require('chai-string'));
chai.use(sinonChai);

const nullConsole = () => {};

describe('ENS register', async () => {
  let provider;
  let wallet;
  let ensAddress;
  let ensRegistrars;
  let publicResolver;
  let label;
  let node;
  let labelHash;
  let config;


  before(async () => {
    ({wallet, provider, ensAddress, ensRegistrars, publicResolver} = await loadFixture(basicENS));
    config = {
      privateKey: wallet.privateKey,
      chainSpec: {
        ensAddress,
        publicResolverAddress: publicResolver,
        chainId: 0,
      },
    };
  });

  describe('DomainRegistrar', async () => {
    let domainRegistrar;
    const tld = 'eth';

    before(() => {
      domainRegistrar = new DomainRegistrar(config, provider, nullConsole);
      label = 'universal-login';
      labelHash = utils.keccak256(utils.toUtf8Bytes(label));
      node = utils.namehash(`${label}.${tld}`);
      domainRegistrar.save = sinon.fake.returns('');
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
    describe('start works', async () => {
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
    let nameRegistrar;
    let domain;
    let publicResolverContract;

    before(async () => {
      nameRegistrar = new ENSNameRegistrar(config, provider, nullConsole);
      label = 'justyna';
      labelHash = utils.keccak256(utils.toUtf8Bytes(label));
      [domain] = ensRegistrars;
      node = utils.namehash(`${label}.${domain}`);
      publicResolverContract = new Contract(publicResolver, PublicResolver.interface, wallet);
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
      const reverseNode = utils.namehash(`${wallet.address.slice(2)}.addr.reverse`.toLowerCase());
      await nameRegistrar.setReverseName(label, domain);
      expect(await publicResolverContract.name(reverseNode)).to.eq(`${label}.${domain}`);
    });

    it('start works', async () => {
      const reverseNode = utils.namehash(`${wallet.address.slice(2)}.addr.reverse`.toLowerCase());
      await nameRegistrar.start('justa', domain);
      expect(await publicResolverContract.addr(utils.namehash(`justa.${domain}`))).to.eq(wallet.address);
      expect(await publicResolverContract.name(reverseNode)).to.eq(`justa.${domain}`);
    });
  });
});
