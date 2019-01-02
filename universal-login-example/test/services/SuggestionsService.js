import {expect} from 'chai';
import sinon from 'sinon';
import SuggestionsService from '../../src/services/SuggestionsService';
import IdentitySelectionService from '../../src/services/IdentitySelectionService';
import {sleep} from '../utils';

describe('SuggestionsService', () => {
  let service;
  let identitySelectionService;

  const sdk = {identityExist: sinon.fake.returns(Promise.resolve(true))};

  before(() => {
    identitySelectionService = new IdentitySelectionService(sdk, ['my.eth', 'log.eth']);
    service = new SuggestionsService(identitySelectionService, {debounceTime: 5});
  });

  it('call callback with proper arguments', async () => {
    const callback = sinon.spy();
    service.setCallback(callback); 
    service.getSuggestions('a');
    expect(callback).to.have.been.calledWith({busy: true});
    await sleep(10);
    expect(callback).to.have.been.calledWith({busy: false, connections: ['a.my.eth', 'a.log.eth'], creations: [], identity: 'a'});
  });
});
