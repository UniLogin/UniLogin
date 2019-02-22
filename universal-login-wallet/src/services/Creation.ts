import UniversalLoginSDK from 'universal-login-sdk';

const createWallet = (sdk: UniversalLoginSDK, userWalletService: any) => async (name: string) => {
  const [privateKey, contractAddress] = await sdk.create(name);
  userWalletService.userWallet = {privateKey, contractAddress, name};
  return [privateKey, contractAddress];
}
export default createWallet;
