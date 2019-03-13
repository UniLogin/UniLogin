import {expect} from 'chai';
import WalletSelectionService from '../../src/services/WalletSelectionService';
import sinon from 'sinon';

const domains = ['my.eth', 'uni.eth', 'app.eth'];

describe('WalletSelectionService', () => {
  describe('Connections', () => {
    it('gets all possible connections', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getConnects('a')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getConnects('bb')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections with . at the end', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getConnects('a.')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getConnects('bb.')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections for identities that exist', async () => {
      const identityExist = sinon.stub();
      identityExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      identityExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      identityExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new WalletSelectionService({identityExist}, domains);
      expect(await service.getConnects('a')).to.deep.eq(['a.my.eth', 'a.app.eth']);
    });

    it('return full domain that exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getConnects('a.my.eth')).to.deep.eq(['a.my.eth']);
    });

    it('returns empty for full domain that does not exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getConnects('a.my.eth')).to.deep.eq([]);
    });

    it('returns empty for invalid prefix ', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getConnects('a.m.a')).to.be.empty;
      expect(await service.getConnects('a..u')).to.be.empty;
      expect(await service.getConnects('a.app.etha')).to.be.empty;
      expect(await service.getConnects('.a.')).to.be.empty;
    });

    it('returns domains for partially entered domains', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getConnects('a.m')).to.deep.eq(['a.my.eth']);
      expect(await service.getConnects('a.u')).to.deep.eq(['a.uni.eth']);
      expect(await service.getConnects('a.ap')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app.')).to.deep.eq(['a.app.eth']);
    });
  });

  describe('Creations', () => {
    it('gets all possible creations', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getCreates('a')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getCreates('bb')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections with . at the end', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getCreates('a.')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getCreates('bb.')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections for identities that exist', async () => {
      const identityExist = sinon.stub();
      identityExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      identityExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      identityExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new WalletSelectionService({identityExist}, domains);
      expect(await service.getCreates('a')).to.deep.eq(['a.uni.eth']);
    });

    it('return full domain that does not exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getCreates('a.my.eth')).to.deep.eq(['a.my.eth']);
    });

    it('returns empty for domain that does exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getCreates('a.my.eth')).to.deep.eq([]);
    });

    it('returns empty for invalid prefix ', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getCreates('a.m.a')).to.be.empty;
      expect(await service.getCreates('a..u')).to.be.empty;
      expect(await service.getCreates('a.app.etha')).to.be.empty;
      expect(await service.getCreates('.a.')).to.be.empty;
    });

    it('returns domains for partially entered domains', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getConnects('a.m')).to.deep.eq(['a.my.eth']);
      expect(await service.getConnects('a.u')).to.deep.eq(['a.uni.eth']);
      expect(await service.getConnects('a.ap')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app.')).to.deep.eq(['a.app.eth']);
    });
  });

  describe('Get all suggestions', () => {
    it('incorrect prefix', async () => {
      const service = new WalletSelectionService({}, domains);
      expect(await service.getSuggestions('..')).to.deep.eq({connections: [], creations: []});
    });

    it('full domain exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, [...domains, 'my.test']);
      expect(await service.getSuggestions('a.my.eth')).to.deep.eq({connections: ['a.my.eth'], creations: []});
      expect(await service.getSuggestions('a.my.test')).to.deep.eq({connections: ['a.my.test'], creations: []});
    });

    it('full domain create', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, domains);
      expect(await service.getSuggestions('a.my.eth')).to.deep.eq({connections: [], creations: ['a.my.eth']});
    });

    it('with secondary domain prefix, identity exists', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new WalletSelectionService(sdk, [...domains, 'my.test']);
      expect(await service.getSuggestions('a.my')).to.deep.eq({connections:['a.my.eth', 'a.my.test'], creations: []});
    });

    it('with secondary domain prefix, identity doesn`t exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new WalletSelectionService(sdk, [...domains, 'my.test']);
      expect(await service.getSuggestions('a.my')).to.deep.eq({connections:[], creations: ['a.my.eth', 'a.my.test']});
    });

    it('returns proper suggestions', async () => {
      const identityExist = sinon.stub();
      identityExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      identityExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      identityExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new WalletSelectionService({identityExist}, domains);
      expect(await service.getSuggestions('a')).to.deep.eq({connections: ['a.my.eth', 'a.app.eth'], creations: ['a.uni.eth']});
    });

    it('invalid domain', async () => {
      const identityExist = sinon.stub();
      identityExist.withArgs('a.nothing.eth').returns(Promise.resolve(false));
      identityExist.withArgs('a.nothing.eth').returns(Promise.resolve(false));
      identityExist.withArgs('a.nothing.eth').returns(Promise.resolve(false));
      const service = new WalletSelectionService({identityExist}, domains);
      expect(await service.getSuggestions('a.nothing.eth')).to.deep.eq({connections: [], creations: []});
      expect(await service.getSuggestions('a.un.eth')).to.deep.eq({connections: [], creations: []});
    });
  });

  describe('Prefix check', () => {
    let service;

    before(() => {
      service = new WalletSelectionService({}, []);
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
});
