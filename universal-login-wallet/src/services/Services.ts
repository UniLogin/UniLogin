import UniversalLoginSDK from 'universal-login-sdk';
import IdentitySelectionService from './IdentitySelectionService';
import SuggestionsService from './SuggestionsService';

interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
}

export interface Services {
  sdk: any;
}

const createServices = (config: Config) => {
  const sdk = new UniversalLoginSDK(config.relayerUrl, config.jsonRpcUrl);
  const identitySelectionService = new IdentitySelectionService(sdk, config.domains);
  const suggestionsService = new SuggestionsService(identitySelectionService);
  return {sdk, suggestionsService, identitySelectionService};
};

export default createServices;
