import {Wallet, providers} from 'ethers';

export type AsyncCommand<T> = (wallet :Wallet) => Promise<T>;

export default async function connectAndExecute<T>(nodeUrl : string, privateKey : string, command : AsyncCommand<T>) {
  const provider = new providers.JsonRpcProvider(nodeUrl);
  const wallet = new Wallet(privateKey, provider);
  await command(wallet);
}
