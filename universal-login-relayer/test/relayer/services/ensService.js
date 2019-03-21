import chai, {expect} from 'chai';
import buildEnsService from '../../helpers/buildEnsService';
import {getWallets, createMockProvider} from 'ethereum-waffle';

chai.use(require('chai-string'));

describe('Relayer - ENSService', async () => {
  let ensService;
  let provider;
  let wallet;
  let ensBuilder;
  const domain = 'mylogin.eth';

  before(async () => {
    provider = createMockProvider();
    [wallet] = await getWallets(provider);
    [ensService, provider, ensBuilder] = await buildEnsService(wallet, domain);
    await ensService.start();
  });

  describe('findRegistrar', () => {
    it('should find resolver and registrar addresses', async () => {
      const registrarInBuilder = ensBuilder.registrars[`${domain}`].address;
      const resolverInBuilder = ensBuilder.resolver.address;
      expect(ensService.findRegistrar(domain).registrarAddress).to.eq(registrarInBuilder);
      expect(ensService.findRegistrar(domain).resolverAddress).to.eq(resolverInBuilder);
    });

    it('return null if not found', async () => {
      expect(ensService.findRegistrar('whatever.non-existing-id.eth')).to.be.null;
    });
  });

  describe('argsFor', () => {
    it('return null if not found', async () => {
      expect(ensService.argsFor('whatever.non-existing-id.eth')).to.be.null;
    });
  });
});
