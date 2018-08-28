import chai from 'chai';
import ENSBuilder from '../../lib/utils/ensBuilder';
import ENSService from '../../lib/relayer/services/ensService';
import {defaultAccounts, getWallets, createMockProvider} from 'ethereum-waffle';

chai.use(require('chai-string'));

const {expect} = chai;

describe('Relayer - ENSService', async () => {
  let ensRegistrars;
  let ensService;
  let provider;
  let mockIdentity;
  let providerWithEns;
  let ensDeployer;
  let ensBuilder;

  before(async () => {
    provider = createMockProvider();
    [ensDeployer, mockIdentity] = await getWallets(provider);
    ensBuilder = new ENSBuilder(ensDeployer);
    providerWithEns = await ensBuilder.bootstrapWith('mylogin', 'eth');
    ensRegistrars = {
      'mylogin.eth': {
        registrarAddress: ensBuilder.registrars['mylogin.eth'].address,
        resolverAddress: ensBuilder.resolver.address,
        privateKey: defaultAccounts[0].secretKey
      }
    };
    ensService = new ENSService(provider, ensBuilder.ens.address, ensRegistrars);
  });

  describe('register', () => {
    let privateKey;
    let registrarAddress;
    let resolverAddress;

    before(() => {
      privateKey = defaultAccounts[0].secretKey;
      registrarAddress = ensBuilder.registrars['mylogin.eth'].address;
      resolverAddress = ensBuilder.resolver.address;
    });

    it('register', async () => {
      const {address} = mockIdentity;
      const ensName = 'alex.mylogin.eth';
      await ensService.register(ensName, address);
      expect(await providerWithEns.resolveName('alex.mylogin.eth')).to.eq(address);
    });

    it('doRegister', async () => {
      const label = 'marek';
      const domain = 'mylogin.eth';
      const {address} = mockIdentity;
      await ensService.doRegister(privateKey, registrarAddress, resolverAddress, label, domain, address);
      expect(await providerWithEns.resolveName('marek.mylogin.eth')).to.eq(address);
    });
  });

  describe('get2ndLevelDomainForm', () => {
    it('simple', () => {
      expect(ensService.get2ndLevelDomainForm('alex.mylogin.eth'))
        .to.deep.eq(['alex', 'mylogin.eth']);
      expect(ensService.get2ndLevelDomainForm('john.mylogin.eth'))
        .to.deep.eq(['john', 'mylogin.eth']);
      expect(ensService.get2ndLevelDomainForm('marek.universal-id.eth'))
        .to.deep.eq(['marek', 'universal-id.eth']);
    });

    it('complex label', () => {
      expect(ensService.get2ndLevelDomainForm('john.and.marek.universal-id.eth'))
        .to.deep.eq(['john.and.marek', 'universal-id.eth']);
    });

    it('empty label', () => {
      expect(ensService.get2ndLevelDomainForm('universal-id.eth'))
        .to.deep.eq(['', 'universal-id.eth']);
    });
  });

  describe('findRegistrar', () => {
    it('find proper registrar by ens name', async () => {
      expect(ensService.findRegistrar('alex.mylogin.eth')).to.deep.eq(ensRegistrars['mylogin.eth']);
      expect(ensService.findRegistrar('marek.mylogin.eth')).to.deep.eq(ensRegistrars['mylogin.eth']);
      expect(ensService.findRegistrar('alex.universal-id.eth')).to.deep.eq(ensRegistrars['universal-id.eth']);
      expect(ensService.findRegistrar('marek.and.friends.universal-id.eth')).to.deep.eq(ensRegistrars['universal-id.eth']);
      expect(ensService.findRegistrar('universal-id.eth')).to.deep.eq(ensRegistrars['universal-id.eth']);
    });

    it('return undefined if not found', async () => {
      expect(ensService.findRegistrar('whatever.non-existing-id.eth')).to.be.undefined;
    });
  });
});
