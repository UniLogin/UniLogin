import {expect} from 'chai';
import createServices from '../src/services/Services';

describe('Services', () => {
  it('Should create services', () => {
    const services = createServices({relayerUrl: 'http://relayer.com', jsonRpcUrl: 'http://mockprovider.com'});
    expect(services).to.not.be.null;
    expect(services.sdk).to.not.be.null;
  });
});