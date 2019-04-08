import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {sleep} from '@universal-login/commons';
import {SuggestionsService} from '../../lib/services/SuggestionsService';
import {WalletSelectionService} from '../../lib/services/WalletSelectionService';

chai.use(sinonChai);

describe('SuggestionsService', () => {
  it('call callback with proper arguments', async () => {
    const walletSelectionService = {getSuggestions: sinon.fake.returns(Promise.resolve({connections: [], creations: []}))};
    const service = new SuggestionsService(walletSelectionService, {debounceTime: 1});
    const callback = sinon.spy();

    service.getSuggestions('a', callback);
    await sleep(20);
    expect(callback).to.have.been.calledWith({connections: [], creations: []});
  });

  it('works fine with WalletSelectionService', async () => {
    const sdk = {walletContractExist: sinon.fake.returns(Promise.resolve(true))};
    const walletSelectionService = new WalletSelectionService(sdk, ['mylogin.eth']);
    const suggestionsService = new SuggestionsService(walletSelectionService, {debounceTime: 1});
    const callback = sinon.spy();

    suggestionsService.getSuggestions('a', callback);
    await sleep(10);
    expect(callback).to.have.been.calledWith({connections: ['a.mylogin.eth'], creations: []});
  });
});
