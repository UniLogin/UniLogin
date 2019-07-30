import {expect} from 'chai';
import {createServices} from '../../../src/ui/createServices';
import getConfig from '../../../src/config/getConfig';

describe('Services', () => {
  it('Should create services', () => {
    const services = createServices(getConfig());
    expect(services).to.not.be.null;
    expect(services.sdk).to.not.be.null;
    expect(services.userDropdownService).to.not.be.null;
    expect(services.connectToWallet).to.not.be.null;
    expect(services.walletService).to.not.be.null;
    expect(services.walletPresenter).to.not.be.null;
    expect(services.tokenService).to.not.be.null;
    expect(services.transferService).to.not.be.null;
    expect(services.balanceService).to.not.be.null;
  });
});
