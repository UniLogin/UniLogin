import {expect} from 'chai';
import IdentitySelectionService from '../../src/services/IdentitySelectionService';
import sinon from 'sinon';

const domains = ['my.eth', 'uni.eth', 'app.eth'];

describe('IdentitySelectionService', async () => {
  describe('Connections', async () => {
    it('gets all possible connections', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getConnects('a')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getConnects('bb')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections with . at the end', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getConnects('a.')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getConnects('bb.')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections for identities that exist', async () => {
      const identityExist = sinon.stub();
      identityExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      identityExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      identityExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new IdentitySelectionService({identityExist}, domains);
      expect(await service.getConnects('a')).to.deep.eq(['a.my.eth', 'a.app.eth']);
    });

    it('return full domain that exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getConnects('a.my.eth')).to.deep.eq(['a.my.eth']);
    });

    it('returns empty for full domain that does not exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getConnects('a.my.eth')).to.deep.eq([]);
    });

    it('returns empty for invalid prefix ', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getConnects('a.m.a')).to.be.empty;
      expect(await service.getConnects('a..u')).to.be.empty;
      expect(await service.getConnects('a.app.etha')).to.be.empty;
      expect(await service.getConnects('.a.')).to.be.empty;
    });

    it('returns domains for partially entered domains', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getConnects('a.m')).to.deep.eq(['a.my.eth']);
      expect(await service.getConnects('a.u')).to.deep.eq(['a.uni.eth']);
      expect(await service.getConnects('a.ap')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app.')).to.deep.eq(['a.app.eth']);
    });
  });

  describe('Creations', async () => {
    it('gets all possible creations', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getCreates('a')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getCreates('bb')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections with . at the end', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getCreates('a.')).to.deep.eq(['a.my.eth', 'a.uni.eth', 'a.app.eth']);
      expect(await service.getCreates('bb.')).to.deep.eq(['bb.my.eth', 'bb.uni.eth', 'bb.app.eth']);
    });

    it('gets connections for identities that exist', async () => {
      const identityExist = sinon.stub();
      identityExist.withArgs('a.my.eth').returns(Promise.resolve(true));
      identityExist.withArgs('a.uni.eth').returns(Promise.resolve(false));
      identityExist.withArgs('a.app.eth').returns(Promise.resolve(true));
      const service = new IdentitySelectionService({identityExist}, domains);
      expect(await service.getCreates('a')).to.deep.eq(['a.uni.eth']);
    });

    it('return full domain that does not exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getCreates('a.my.eth')).to.deep.eq(['a.my.eth']);
    });

    it('returns empty for domain that does exist', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getCreates('a.my.eth')).to.deep.eq([]);
    });

    it('returns empty for invalid prefix ', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(false))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getCreates('a.m.a')).to.be.empty;
      expect(await service.getCreates('a..u')).to.be.empty;
      expect(await service.getCreates('a.app.etha')).to.be.empty;
      expect(await service.getCreates('.a.')).to.be.empty;
    });

    it('returns domains for partially entered domains', async () => {
      const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
      const service = new IdentitySelectionService(sdk, domains);
      expect(await service.getConnects('a.m')).to.deep.eq(['a.my.eth']);
      expect(await service.getConnects('a.u')).to.deep.eq(['a.uni.eth']);
      expect(await service.getConnects('a.ap')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app')).to.deep.eq(['a.app.eth']);
      expect(await service.getConnects('a.app.')).to.deep.eq(['a.app.eth']);
    });
  });
});
