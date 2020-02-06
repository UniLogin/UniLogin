import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {utils} from 'ethers';
import {PublicRelayerConfig} from '@universal-login/commons';
import {startRelayer} from '../testhelpers/http';
import {getPublicConfig} from '../../src/http/routes/config';
import {RelayerUnderTest} from '../../src';

chai.use(chaiHttp);

describe('E2E: Relayer - Config routes', async () => {
  let relayer: RelayerUnderTest;

  before(async () => {
    ({relayer} = await startRelayer());
  });

  it('should return public config', async () => {
    const {supportedTokens, chainSpec, factoryAddress, contractWhiteList, localization, onRampProviders, maxGasLimit, ipGeolocationApi, privateKey, ensRegistrar, walletContractAddress} = relayer.getConfig();
    const expectedConfig: PublicRelayerConfig = {
      ensRegistrar,
      supportedTokens,
      chainSpec,
      walletContractAddress,
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
    expect(result.body.config).to.deep.eq(expectedConfig);
  });

  it('getPublicConfig should return PublicConfig', () => {
    const {supportedTokens, chainSpec, factoryAddress, contractWhiteList, localization, onRampProviders, maxGasLimit, ipGeolocationApi, privateKey, ensRegistrar, walletContractAddress} = relayer.getConfig();
    const expectedConfig: PublicRelayerConfig = {
      ensRegistrar,
      supportedTokens,
      chainSpec,
      walletContractAddress,
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
