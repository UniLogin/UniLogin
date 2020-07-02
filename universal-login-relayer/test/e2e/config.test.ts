import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils} from 'ethers';
import {PublicRelayerConfig} from '@unilogin/commons';
import {startRelayer} from '../testhelpers/http';
import {getPublicConfig} from '../../src/http/routes/config';
import {RelayerUnderTest} from '../../src';

chai.use(chaiHttp);

describe('E2E: Relayer - Config routes', () => {
  let relayer: RelayerUnderTest;

  before(async () => {
    ({relayer} = await startRelayer());
  });

  it('should return public config', async () => {
    const {supportedTokens, ensAddress, network, factoryAddress, contractWhiteList, localization, onRampProviders, maxGasLimit, ipGeolocationApi, privateKey, ensRegistrar, walletContractAddress, fallbackHandlerAddress} = relayer.getConfig();
    const expectedConfig: PublicRelayerConfig = {
      ensRegistrar,
      supportedTokens,
      ensAddress,
      network,
      walletContractAddress,
      fallbackHandlerAddress,
      factoryAddress,
      contractWhiteList,
      localization,
      onRampProviders,
      maxGasLimit,
      ipGeolocationApi,
      relayerAddress: utils.computeAddress(privateKey),
    };
    const result = await chai.request(relayer.getServer())
      .get('/config');
    expect(result.body).to.deep.eq(expectedConfig);
  });

  it('getPublicConfig should return PublicConfig', () => {
    const {supportedTokens, ensAddress, network, factoryAddress, contractWhiteList, localization, onRampProviders, maxGasLimit, ipGeolocationApi, privateKey, ensRegistrar, walletContractAddress, fallbackHandlerAddress} = relayer.getConfig();
    const expectedConfig: PublicRelayerConfig = {
      ensRegistrar,
      supportedTokens,
      ensAddress,
      network,
      walletContractAddress,
      fallbackHandlerAddress,
      factoryAddress,
      contractWhiteList,
      localization,
      onRampProviders,
      maxGasLimit,
      ipGeolocationApi,
      relayerAddress: utils.computeAddress(privateKey),
    };
    const publicConfig = getPublicConfig(relayer.getConfig());

    expect(publicConfig).to.deep.eq(expectedConfig);
  });

  after(async () => {
    await relayer.stop();
  });
});
