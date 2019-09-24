export interface Config {
  domains: string[];
  relayerUrl: string;
  jsonRpcUrl: string;
  tokens: string[];
  ipGeolocationApi: IPGeolocationApiConfig;
}

export interface IPGeolocationApiConfig {
  baseUrl: string;
  accessKey: string;
}
