import dotenv from 'dotenv';
import {ETHER_NATIVE_TOKEN, getEnv, UNILOGIN_LOGO_WITH_NAME_URL} from '@unilogin/commons';
dotenv.config();

export const baseConfig = {
  supportedTokens: [{
    address: ETHER_NATIVE_TOKEN.address,
  }],
  localization: {
    language: 'en',
    country: 'any',
  },
  maxGasLimit: 500000,
  ipGeolocationApi: {
    baseUrl: 'https://api.ipdata.co',
    accessKey: 'c7fd60a156452310712a66ca266558553470f80bf84674ae7e34e9ee',
  },
  contractWhiteList: {
    wallet: [
      '0x0fc2be641158de5ed5cdbc4cec010c762bc74771e51b15432bb458addac3513d',
      '0x6575c72edecb8ce802c58b1c1b9cbb290ef2b27588b76c73302cb70b862702a7',
      '0x56b8be58b5ad629a621593a2e5e5e8e9a28408dc06e95597497b303902772e45',
    ],
    proxy: [
      '0xb68afa7e9356b755f3d76e981adaa503336f60df29b28c0a8013c17cecb750bb',
      '0xaea7d4252f6245f301e540cfbee27d3a88de543af8e49c5c62405d5499fab7e5',
    ],
  },
  httpsRedirect: getEnv('HTTPS_REDIRECT', '') === 'true',
  port: getEnv('PORT', ''),
  privateKey: getEnv('PRIVATE_KEY', ''),
  email: {
    copyToClipboardUrl: 'https://universal-provider-backend.netlify.app/copy',
    emailLogo: UNILOGIN_LOGO_WITH_NAME_URL,
    apiKey: getEnv('MANDRILL_API_KEY', ''),
    from: 'noreply@unilogin.io',
  },
  codeExpirationTimeInMinutes: 30,
};
