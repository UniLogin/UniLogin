const CreationSerivce = (sdk: any, userWalletService: any) => async (name: string) => {
  const [privateKey, contractAddress] = await sdk.create(name);
  userWalletService.userWallet = {privateKey, contractAddress, name};
  return [privateKey, contractAddress];
}
export default CreationSerivce;
