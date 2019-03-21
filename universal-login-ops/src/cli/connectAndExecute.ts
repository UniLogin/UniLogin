import {Wallet, providers} from 'ethers';
import {devJsonRpcUrl} from 'universal-login-commons';

export type AsyncCommand<T> = (wallet :Wallet) => Promise<T>;

export default async function connectAndExecute<T>(nodeUrl : string, privateKey : string, command : AsyncCommand<T>) {
  const {wallet} = connect(nodeUrl, privateKey);
  await command(wallet);
}

export const connect = (givenNodeUrl : string, privateKey : string, givenProvider?: providers.Provider) => {
  const nodeUrl = givenNodeUrl ? givenNodeUrl : devJsonRpcUrl;
  const provider = givenProvider ? givenProvider : new providers.JsonRpcProvider(nodeUrl);
  const wallet = new Wallet(privateKey, provider);
  return {provider, wallet};
}
