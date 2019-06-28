import UniversalLoginSDK from '@universal-login/sdk';

const createWallet = (sdk: UniversalLoginSDK, walletService: any) => async (name: string) => {
  const [privateKey, contractAddress] = await sdk.create(name);
  walletService.connect({privateKey, contractAddress, name});
  return [privateKey, contractAddress];
};
export default createWallet;
