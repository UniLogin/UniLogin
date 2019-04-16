import {createServices} from '../../../src/services/Services';
import {providers} from 'ethers';
import {testJsonRpcUrl} from '@universal-login/commons';

export const createPreconfiguredServices = async (provider: providers.Provider, relayer: any, tokens: string[]) => {
    const domains = relayer.config.ensRegistrars;
    const config = {
      jsonRpcUrl: testJsonRpcUrl,
      relayerUrl: relayer.url(),
      domains,
      tokens
    };
    return createServices(config, {provider});
};
