import UniversalLoginSDK from 'universal-login-sdk';

export const transfer = (sdk: UniversalLoginSDK) => async (to: string, amount: string, currency: string) => {
  sdk.execute({}, '0x1');
}