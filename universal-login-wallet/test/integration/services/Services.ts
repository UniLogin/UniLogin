import {expect} from 'chai';
import {createServices} from '../../../src/ui/createServices';
import getConfig from '../../../src/config/getConfig';
import {ETHER_NATIVE_TOKEN} from '@universal-login/commons';

describe('Services', () => {
  it('Should create services', () => {
    const config = {...getConfig(), tokens: [ETHER_NATIVE_TOKEN.address]};
    const services = createServices(config);
    expect(services).to.not.be.null;
    expect(services.sdk).to.not.be.null;
    expect(services.userDropdownService).to.not.be.null;
    expect(services.connectToWallet).to.not.be.null;
    expect(services.walletService).to.not.be.null;
    expect(services.walletPresenter).to.not.be.null;
    expect(services.sdk.tokensDetailsStore).to.not.be.null;
  });
});
