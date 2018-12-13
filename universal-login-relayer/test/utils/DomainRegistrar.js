import chai, {expect} from 'chai';
import sinonChai from 'sinon-chai';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicENS from '../fixtures/basicENS';
import DomainRegistrar from '../../lib/utils/ENS/DomainRegistrar';
import ENSNameRegistrar from '../../lib/utils/ENS/ENSNameRegistrar';
import {utils, Contract} from 'ethers';
import PublicResolver from 'universal-login-contracts/build/PublicResolver';

chai.use(require('chai-string'));
chai.use(sinonChai);


describe('ENS register', async () => {
  const testHelper = new TestHelper();
  let provider;
  let wallet;
  let domainRegistrar;
  let nameRegistrar;
  let ensAddress;
  let ensRegistrars;
  let publicResolver;
  let labelToRegister;
  let node;
  let labelHash;
  const tld = 'eth';


  before(async () => {
    ({wallet, provider, ensAddress, ensRegistrars, publicResolver} = await testHelper.load(basicENS));
    const config = {
      privateKey: wallet.privateKey,
      chainSpec: {
        ensAddress,
        publicResolverAddress: publicResolver,
        chainId: 0
      }
    };
    domainRegistrar = new DomainRegistrar(config, provider);
    nameRegistrar = new ENSNameRegistrar(config, provider);
    labelToRegister = 'universal-login';
    labelHash = utils.keccak256(utils.toUtf8Bytes(labelToRegister));
    node = utils.namehash(`${labelToRegister}.${tld}`);
  });

  describe('DomainRegistrar', async () => { 
    it('Should register label to register', async () => {
      await domainRegistrar.registerInRegistrar(labelToRegister, labelHash, node, tld);
      expect(await domainRegistrar.ens.owner(node)).to.eq(wallet.address);
    });

    it('Should set resolver', async () => {
      await domainRegistrar.setAsResolverPublicResolver(labelToRegister, node, tld);
      expect(await domainRegistrar.ens.resolver(node)).to.eq(publicResolver);
    });

    it('should set new registrar as domain owner', async () => {
      const registrarAddress = await domainRegistrar.deployNewRegistrar(node);
      await domainRegistrar.setRegistrarAsOwner(labelToRegister, node, tld);
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
    let domain;
    let labelHash;
    let node;
    let label;
    let publicResolver;

    before(async () => {
      label = 'justyna';
      labelHash = utils.keccak256(utils.toUtf8Bytes(label));
      [domain] = Object.keys(ensRegistrars);
      node = utils.namehash(`${label}.${domain}`);
      publicResolver = new Contract(ensRegistrars[domain].resolverAddress, PublicResolver.interface, wallet);
      await nameRegistrar.prepareNameRegistration(domain);
    });

    it('should register name', async () => {
      await nameRegistrar.registerName(labelHash, domain);
      expect(await nameRegistrar.ens.owner(node)).to.eq(wallet.address);
    });

    it('should ser resolver', async () => {
      await nameRegistrar.setResolver(node, label, domain);
      expect(await nameRegistrar.ens.resolver(node)).to.eq(ensRegistrars[domain].resolverAddress);
    });

    it('should set address', async () => {
      await nameRegistrar.setAddress(node, label, domain);
      expect(await publicResolver.addr(node)).to.eq(wallet.address);
    });

    it('should set name', async () => {
      const reverseNode = utils.namehash(`${wallet.address.slice(2)}.addr.reverse`.toLowerCase());
      await nameRegistrar.setReverseName(label, domain);
      expect(await publicResolver.name(reverseNode)).to.eq(`${label}.${domain}`);
    });

    it('start works', async () => {
      const reverseNode = utils.namehash(`${wallet.address.slice(2)}.addr.reverse`.toLowerCase());
      await nameRegistrar.start('justa', domain);
      expect(await publicResolver.addr(utils.namehash(`justa.${domain}`))).to.eq(wallet.address);
      expect(await publicResolver.name(reverseNode)).to.eq(`justa.${domain}`);
    });
  });
});
