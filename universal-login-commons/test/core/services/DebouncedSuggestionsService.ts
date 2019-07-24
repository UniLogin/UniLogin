import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {sleep} from '../../../lib';
import {DebouncedSuggestionsService} from '../../../lib/core/services/DebouncedSuggestionsService';
import {SuggestionsService} from '../../../lib/core/services/SuggestionsService';

chai.use(sinonChai);

describe('DebouncedSuggestionsService', () => {
  it('call callback with proper arguments', async () => {
    const suggestionsService = {getSuggestions: sinon.fake.returns(Promise.resolve({connections: [], creations: []}))};
    const debouncedSuggestionsService = new DebouncedSuggestionsService(suggestionsService as any, {debounceTime: 1});
    const callback = sinon.spy();

    debouncedSuggestionsService.getSuggestions('a', callback);
    await sleep(20);
    expect(callback).to.have.been.calledWith({connections: [], creations: []});
  });

  it('works fine with SuggestionsService', async () => {
    const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
    const suggestionsService = new SuggestionsService(sdk, ['mylogin.eth']);
    const debouncedSuggestionsService = new DebouncedSuggestionsService(suggestionsService, {debounceTime: 1});
    const callback = sinon.spy();

    debouncedSuggestionsService.getSuggestions('a', callback);
    await sleep(10);
    expect(callback).to.have.been.calledWith({connections: ['a.mylogin.eth'], creations: []});
  });
});
