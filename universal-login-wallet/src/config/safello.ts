export const safelloUrlConfig = {
  language: 'en',
  country: 'other',
  crypto: 'eth',
};

export interface SafelloConfig {
  language: string;
  country: string;
  crypto: string;
}

export const getSafelloUrl = (urlConfig: SafelloConfig) => 'https://app.s4f3.io/sdk/quickbuy.html?appId=1234-5678' +
  '&border=true' +
  '&address-helper=true' +
  `&lang=${urlConfig.language}` +
  `&country=${urlConfig.country}` +
  `&crypto=${urlConfig.crypto}`;
