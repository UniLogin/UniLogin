import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import { Wallet, ContractFactory } from 'ethers';
import { defaultDeployOptions } from '@universal-login/commons';


export default async function deployMasterContract(wallet: Wallet) {
  console.log('Deploying wallet master contract...');
  const deployTransaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(WalletMaster.abi, WalletMaster.bytecode).getDeployTransaction(),
  };
  const transaction = await wallet.sendTransaction(deployTransaction);
  console.log(`Transaction hash: ${transaction.hash}`);
  const receipt = await wallet.provider.waitForTransaction(transaction.hash!);
  console.log(`Wallet master contract address: ${receipt.contractAddress}`);
}