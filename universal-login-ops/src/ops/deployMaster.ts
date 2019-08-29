import WalletContract from '@universal-login/contracts/build/Wallet.json';
import {Wallet, utils} from 'ethers';
import {deployContractAndWait} from '@universal-login/commons';


export default async function deployMasterContract(wallet: Wallet) {
  console.log('Deploying wallet master contract...');
  const overrides = {gasLimit: utils.bigNumberify(5000000)};
  const contractAddress = await deployContractAndWait(wallet, WalletContract as any, [], overrides);
  console.log(`Wallet master contract address: ${contractAddress}`);
}
