import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import WalletMasterWithRefund from '@universal-login/contracts/build/WalletMasterWithRefund.json';
import {Wallet, utils} from 'ethers';
import {deployContract} from '@universal-login/commons';


export default async function deployMasterContract(wallet: Wallet) {
  console.log('Deploying wallet master contract...');
  const overrides = {gasLimit: utils.bigNumberify(4000000)};
  const contract = await deployContract(wallet, WalletMaster, [], overrides);
  console.log(`Wallet master contract address: ${contract.address}`);
}

export async function deployMasterContractWithRefund(wallet: Wallet) {
  console.log(`Deploying wallet master with refund contract...`);
  const overrides = {gasLimit: utils.bigNumberify(4000000)};
  const contract = await deployContract(wallet, WalletMasterWithRefund, [], overrides);
  console.log(`Wallet master with refund contract address: ${contract.address}`);
}
