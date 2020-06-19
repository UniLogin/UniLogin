import chai, {expect} from 'chai';
import {MockProvider} from 'ethereum-waffle';
import {Wallet} from 'ethers';
import ENSService from '../../../src/integration/ethereum/ensService';
import {buildEnsService, registerENSName} from '../../testhelpers/buildEnsService';

chai.use(require('chai-string'));

describe('INT: ENSService', () => {
  let ensService: ENSService;
  let provider: MockProvider;
  let ensBuilder: any;
  let wallet: Wallet;
  const domain = 'mylogin.eth';

  before(async () => {
    provider = new MockProvider();
    [wallet] = provider.getWallets();
    [ensService, provider, ensBuilder] = await buildEnsService(wallet, domain);
  });

  describe('findRegistrar', () => {
    it('should find resolver and registrar addresses', () => {
      const registrarInBuilder = ensBuilder.registrars[`${domain}`].address;
      const resolverInBuilder = ensBuilder.resolver.address;
      expect(ensService.findRegistrar(domain).registrarAddress).to.eq(registrarInBuilder);
      expect(ensService.findRegistrar(domain).resolverAddress).to.eq(resolverInBuilder);
    });

    it('return null if not found', () => {
      expect(ensService.findRegistrar('whatever.non-existing-id.eth')).to.be.null;
    });
  });

  describe('argsFor', () => {
    it('throws error if invalid ENS domain', async () => {
      const ensName = 'whatever.non-existing-id.eth';
      await expect(ensService.argsFor(ensName)).to.be.eventually.rejectedWith(`ENS domain ${ensName} does not exist or is not compatible with Universal Login`);
    });

    it('throws error if ENS name is taken', async () => {
      const ensName = 'name.mylogin.eth';
      await registerENSName(wallet, ensBuilder.ens.address, ensName);
      await expect(ensService.argsFor(ensName)).to.be.eventually.rejectedWith(`ENS name ${ensName} already taken`);
    });
  });
});
