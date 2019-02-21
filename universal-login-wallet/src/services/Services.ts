import UniversalLoginSDK from 'universal-login-sdk';
import {IdentitySelectionService, SuggestionsService} from 'universal-login-commons';
import {EventEmitter} from 'fbemitter';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
}

export interface Services {
  sdk: any;
  emitter: any;
}

const createServices = (config: Config) => {
  const sdk = new UniversalLoginSDK(config.relayerUrl, config.jsonRpcUrl);
  const identitySelectionService = new IdentitySelectionService(sdk, config.domains);
  const suggestionsService = new SuggestionsService(identitySelectionService);
  const emitter = new EventEmitter();
  return {sdk, suggestionsService, identitySelectionService, emitter};
};

export default createServices;
