import chai, {expect} from 'chai';
import ENSService from '../../../lib/services/ensService';

chai.use(require('chai-string'));

describe('Relayer - ENSService', async () => {
  let ensRegistrars;
  let ensService;

  before(async () => {
    ensRegistrars = {
      'mylogin.eth': {
        registrarAddress: '0x1',
        resolverAddress: '0x2',
        privateKey: '0x3'
      },
      'universal-id.eth': {
        registrarAddress: '0x1',
        resolverAddress: '0x2',
        privateKey: '0x3'
      }
    };
    ensService = new ENSService('0x4', ensRegistrars);
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
