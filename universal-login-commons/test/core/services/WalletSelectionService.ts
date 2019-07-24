import {expect} from 'chai';
import {WalletSelectionService} from '../../../lib/core/services/WalletSelectionService';
import sinon from 'sinon';
import {WalletSelectionAction} from '../../../lib';

const domains = ['my.eth', 'uni.eth', 'app.eth'];

describe('WalletSelectionService', () => {
  describe('Connections', () => {
    it('gets all possible connections', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a'))!.connections).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect((await service.getSuggestions('bb'))!.connections).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections with . at the end', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.'))!.connections).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect((await service.getSuggestions('bb.'))!.connections).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections for wallet contracts that exist', async () => {
      const walletContractExist = sinon.stub();
      walletContractExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      walletContractExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      walletContractExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new WalletSelectionService({walletContractExist}, domains);
      expect((await service.getSuggestions('a'))!.connections).to.deep.eq(['a.my.eth', 'a.app.eth']);
    });

    it('return full domain that exist', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.my.eth'))!.connections).to.deep.eq(['a.my.eth']);
    });

    it('returns empty for full domain that does not exist', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.my.eth'))!.connections).to.deep.eq([]);
    });

    it('returns empty for invalid prefix ', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.m.a'))!.connections).to.be.empty;
      expect((await service.getSuggestions('a..u'))!.connections).to.be.empty;
      expect((await service.getSuggestions('a.app.etha'))!.connections).to.be.empty;
      expect((await service.getSuggestions('.a.'))!.connections).to.be.empty;
    });

    it('returns domains for partially entered domains', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.m'))!.connections).to.deep.eq(['a.my.eth']);
      expect((await service.getSuggestions('a.u'))!.connections).to.deep.eq(['a.uni.eth']);
      expect((await service.getSuggestions('a.ap'))!.connections).to.deep.eq(['a.app.eth']);
      expect((await service.getSuggestions('a.app'))!.connections).to.deep.eq(['a.app.eth']);
      expect((await service.getSuggestions('a.app.'))!.connections).to.deep.eq(['a.app.eth']);
    });
  });

  describe('Creations', () => {
    it('gets all possible creations', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a'))!.creations).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect((await service.getSuggestions('bb'))!.creations).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections with . at the end', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.'))!.creations).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect((await service.getSuggestions('bb.'))!.creations).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections for wallet contracts that exist', async () => {
      const walletContractExist = sinon.stub();
      walletContractExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      walletContractExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      walletContractExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new WalletSelectionService({walletContractExist}, domains);
      expect((await service.getSuggestions('a'))!.creations).to.deep.eq(['a.uni.eth']);
    });

    it('return full domain that does not exist', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.my.eth'))!.creations).to.deep.eq(['a.my.eth']);
    });

    it('returns empty for domain that does exist', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.my.eth'))!.creations).to.deep.eq([]);
    });

    it('returns empty for invalid prefix ', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.m.a'))!.creations).to.be.empty;
      expect((await service.getSuggestions('a..u'))!.creations).to.be.empty;
      expect((await service.getSuggestions('a.app.etha'))!.creations).to.be.empty;
      expect((await service.getSuggestions('.a.'))!.creations).to.be.empty;
    });

    it('returns domains for partially entered domains', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect((await service.getSuggestions('a.m'))!.connections).to.deep.eq(['a.my.eth']);
      expect((await service.getSuggestions('a.u'))!.connections).to.deep.eq(['a.uni.eth']);
      expect((await service.getSuggestions('a.ap'))!.connections).to.deep.eq(['a.app.eth']);
      expect((await service.getSuggestions('a.app'))!.connections).to.deep.eq(['a.app.eth']);
      expect((await service.getSuggestions('a.app.'))!.connections).to.deep.eq(['a.app.eth']);
    });
  });

  describe('Get all suggestions', () => {
    it('incorrect prefix', async () => {
      const service = new WalletSelectionService({} as any, domains);
      expect(await service.getSuggestions('..')).to.deep.eq({connections: [], creations: []});
    });

    it('full domain exist', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, [...domains, 'my.test']);
      expect(await service.getSuggestions('a.my.eth')).to.deep.eq({connections: ['a.my.eth'], creations: []});
      expect(await service.getSuggestions('a.my.test')).to.deep.eq({connections: ['a.my.test'], creations: []});
    });

    it('full domain create', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getSuggestions('a.my.eth')).to.deep.eq({connections: [], creations: ['a.my.eth']});
    });

    it('with secondary domain prefix, wallet contract exists', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, [...domains, 'my.test']);
      expect(await service.getSuggestions('a.my')).to.deep.eq({connections: ['a.my.eth', 'a.my.test'], creations: []});
    });

    it('with secondary domain prefix, wallet contract doesn`t exist', async () => {
      const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, [...domains, 'my.test']);
      expect(await service.getSuggestions('a.my')).to.deep.eq({connections: [], creations: ['a.my.eth', 'a.my.test']});
    });

    it('returns proper suggestions', async () => {
      const walletContractExist = sinon.stub();
      walletContractExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      walletContractExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      walletContractExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new WalletSelectionService({walletContractExist}, domains);
      expect(await service.getSuggestions('a')).to.deep.eq({connections: ['a.my.eth', 'a.app.eth'], creations: ['a.uni.eth']});
    });

    it('invalid domain', async () => {
      const walletContractExist = sinon.stub();
      walletContractExist.withArgs('a.nothing.eth').returns(Promise.resolve(false));
      walletContractExist.withArgs('a.nothing.eth').returns(Promise.resolve(false));
      walletContractExist.withArgs('a.nothing.eth').returns(Promise.resolve(false));
      const service = new WalletSelectionService({walletContractExist}, domains);
      expect(await service.getSuggestions('a.nothing.eth')).to.deep.eq({connections: [], creations: []});
      expect(await service.getSuggestions('a.un.eth')).to.deep.eq({connections: [], creations: []});
    });
  });

  describe('Prefix check', () => {
    let service: WalletSelectionService;

    before(() => {
      service = new WalletSelectionService({} as any, []);
    });

    it('returns true if there is no domain', () => {
      expect(service.isCorrectPrefix('a')).to.be.true;
      expect(service.isCorrectPrefix('a.my')).to.be.true;
    });

    it('works for `eth`', () => {
      expect(service.isCorrectPrefix('a.my.e')).to.be.true;
      expect(service.isCorrectPrefix('a.my.et')).to.be.true;
      expect(service.isCorrectPrefix('a.my.eth')).to.be.true;
    });

    it('empty', () => {
      expect(service.isCorrectPrefix('')).to.be.false;
    });

    it('too many segments', () => {
      expect(service.isCorrectPrefix('a.b.c.d')).to.be.false;
    });

    it('returns true for `test`', () => {
      expect(service.isCorrectPrefix('a.my.t')).to.be.true;
      expect(service.isCorrectPrefix('a.my.te')).to.be.true;
      expect(service.isCorrectPrefix('a.my.tes')).to.be.true;
      expect(service.isCorrectPrefix('a.my.test')).to.be.true;
    });

    it('returns true for `xyz`', () => {
      expect(service.isCorrectPrefix('a.my.x')).to.be.true;
      expect(service.isCorrectPrefix('a.my.xy')).to.be.true;
      expect(service.isCorrectPrefix('a.my.xyz')).to.be.true;
    });

    it('returns false for invalid domains', () => {
      expect(service.isCorrectPrefix('a.my.bad')).to.be.false;
      expect(service.isCorrectPrefix('a.my.s')).to.be.false;
      expect(service.isCorrectPrefix('a.my.th')).to.be.false;
    });

    it('labels with dash', () => {
      expect(service.isCorrectPrefix('a-b')).to.be.true;
    });

    it('ends with .', () => {
      expect(service.isCorrectPrefix('a.')).to.be.true;
      expect(service.isCorrectPrefix('a.my-log.')).to.be.true;
      expect(service.isCorrectPrefix('a..')).to.be.false;
      expect(service.isCorrectPrefix('...')).to.be.false;
      expect(service.isCorrectPrefix('a.b..')).to.be.false;
      expect(service.isCorrectPrefix('..')).to.be.false;
      expect(service.isCorrectPrefix('.')).to.be.false;
    });

    it('domains with dashes', () => {
      expect(service.isCorrectPrefix('a.my-')).to.be.true;
      expect(service.isCorrectPrefix('a.my-log')).to.be.true;
      expect(service.isCorrectPrefix('a.my-super-')).to.be.true;
      expect(service.isCorrectPrefix('a.my-super-domain')).to.be.true;
    });
  });

  describe('With custom actions', () => {
    const walletContractExist = sinon.stub();
    const sdk = {walletContractExist};

    before(() => {
      walletContractExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      walletContractExist.withArgs('a.you.eth').returns(Promise.resolve(false));
      walletContractExist.withArgs('a.them.eth').returns(Promise.resolve(true));
    });

    it('none', async () => {
      const service = new WalletSelectionService(sdk, ['my.eth', 'you.eth', 'them.eth'], []);
      expect(await service.getSuggestions('a')).to.deep.eq({
        connections: [],
        creations: []
      });
    });

    it('default (all)', async () => {
      const service = new WalletSelectionService(sdk, ['my.eth', 'you.eth', 'them.eth']);
      expect(await service.getSuggestions('a')).to.deep.eq({
        connections: ['a.my.eth', 'a.them.eth'],
        creations: ['a.you.eth']
      });
    });

    it('only connect', async () => {
      const service = new WalletSelectionService(sdk, ['my.eth', 'you.eth', 'them.eth'], [WalletSelectionAction.connect]);
      expect(await service.getSuggestions('a')).to.deep.eq({
        connections: ['a.my.eth', 'a.them.eth'],
        creations: []
      });
    });

    it('only create', async () => {
      const service = new WalletSelectionService(sdk, ['my.eth', 'you.eth', 'them.eth'], [WalletSelectionAction.create]);
      expect(await service.getSuggestions('a')).to.deep.eq({
        connections: [],
        creations: ['a.you.eth']
      });
    });

    it('only recover', async () => {
      const service = new WalletSelectionService(sdk, ['my.eth', 'you.eth', 'them.eth'], [WalletSelectionAction.recover]);
      expect(await service.getSuggestions('a')).to.deep.eq({
        connections: ['a.my.eth', 'a.them.eth'],
        creations: []
      });
    });

  });
});
