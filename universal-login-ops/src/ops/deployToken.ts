import Token from '../contracts/Token.json';
import {Wallet, ContractFactory} from 'ethers';
import {defaultDeployOptions} from '@universal-login/commons';


export default async function deployToken(wallet: Wallet) {
  console.log('Deploying token contract...');
  const deployTransaction = {
    ...defaultDeployOptions,
    ...new ContractFactory(Token.abi, Token.bytecode).getDeployTransaction()
  };
  const transaction = await wallet.sendTransaction(deployTransaction);
  console.log(`Transaction hash: ${transaction.hash}`);
  const receipt = await wallet.provider.waitForTransaction(transaction.hash!);
  console.log(`Token address: ${receipt.contractAddress}`);
}
