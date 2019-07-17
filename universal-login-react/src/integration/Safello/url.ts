export interface UrlConfig {
  contractAddress: string;
  language: string;
  country: string;
  crypto: string;
}

export const getSafelloUrl = (urlConfig: UrlConfig) => 'https://app.s4f3.io/sdk/quickbuy.html?appId=1234-5678' +
  '&border=true' +
  '&address-helper=true' +
  `&lang=${urlConfig.language}` +
  `&country=${urlConfig.country}` +
  `&crypto=${urlConfig.crypto}` +
  `&address=${urlConfig.contractAddress}`;
