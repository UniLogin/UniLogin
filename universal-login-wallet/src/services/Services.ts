import {EventEmitter} from 'fbemitter';
import UniversalLoginSDK from 'universal-login-sdk';
import IdentityService from './IdentityService';
import TokenService from './TokenService';
import {IdentitySelectionService, SuggestionsService} from 'universal-login-commons';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokenAddress: string;
}

export interface Services {
  sdk: any;
}

const createServices = (config: Config) => {
  const emitter = new EventEmitter();
  const sdk = new UniversalLoginSDK(config.relayerUrl, config.jsonRpcUrl);
  const tokenService = new TokenService(config.tokenAddress, sdk.provider);
  const identityService = new IdentityService(sdk, emitter, config.tokenAddress);
  const identitySelectionService = new IdentitySelectionService(sdk, config.domains);
  const suggestionsService = new SuggestionsService(identitySelectionService);
  return {sdk, suggestionsService, identitySelectionService, identityService, emitter, tokenService};
};

export default createServices;
