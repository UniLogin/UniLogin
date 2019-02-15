import chai, {expect} from 'chai';
import sinon from 'sinon';
import {sleep} from '../src/services/utils/utils';
import SuggestionsService from '../src/services/SuggestionsService';
import sinonChai from 'sinon-chai';
import IdentitySelectionService from '../src/services/IdentitySelectionService';

chai.use(sinonChai);

describe('SuggestionsService', () => {
  it('call callback with proper arguments', async () => {
    const identitySelectionService = {getSuggestions: sinon.fake.returns(Promise.resolve({connections: [], creations: []}))};
    const service = new SuggestionsService(identitySelectionService, {debounceTime: 10});
    const callback = sinon.spy();

    service.setCallback(callback);
    service.getSuggestions('a');
    expect(callback).to.have.been.calledWith({busy: true});
    await sleep(20);
    expect(callback).to.have.been.calledWith({busy: false, connections: [], creations: [], name: 'a'});
  });

  it('SuggestionsService works fine with IdentitySelectionService', async () => {
    const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};
    const identitySelectionService = new IdentitySelectionService(sdk, ['mylogin.eth']);
    const suggestionsService = new SuggestionsService(identitySelectionService, 10);
    const callback = sinon.spy();

    suggestionsService.setCallback(callback);
    suggestionsService.getSuggestions('a');
    expect(callback).to.have.been.calledWith({busy: true});
    await sleep(20);
    expect(callback).to.have.been.calledWith({busy: false, connections: ['a.mylogin.eth'], creations: [], name: 'a'});
  });
});
