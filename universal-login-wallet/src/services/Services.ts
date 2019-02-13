const UniversalLoginSDK = require('universal-login-sdk').default;

interface Config {
  relayerUrl: string;
  jsonRpcUrl: string;
}

export interface Services {
  sdk: any;
}

const createServices = (config: Config) => {
  const sdk = new UniversalLoginSDK(config.relayerUrl, config.jsonRpcUrl);
  return {sdk};
};

export default createServices;
