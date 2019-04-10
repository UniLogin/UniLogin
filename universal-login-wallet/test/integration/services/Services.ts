import {expect} from 'chai';
import {createServices} from '../../../src/services/Services';
import getConfig from '../../../src/config/getConfig';

describe('Services', () => {
  it('Should create services', () => {
    const services = createServices(getConfig());
    expect(services).to.not.be.null;
    expect(services.sdk).to.not.be.null;
    expect(services.walletSelectionService).to.not.be.null;
    expect(services.suggestionsService).to.not.be.null;
  });
});
