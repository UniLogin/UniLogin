import ERC1077ApprovalScheme from '../../build/ERC1077';
import MockToken from '../../build/MockToken';
import MockContract from '../../build/MockContract';
import {utils} from 'ethers';
import {deployContract} from 'ethereum-waffle';
import {addressToBytes32} from '../utils';

const {parseEther} = utils;

export default async function basicIdentity(provider, wallet) {
  const publicKey = addressToBytes32(wallet.address);
  const keyAsAddress = wallet.address;
  const privateKey = addressToBytes32(wallet.privateKey);
  const identity = await deployContract(wallet, ERC1077ApprovalScheme, [publicKey]);
  const mockToken = await deployContract(wallet, MockToken);
  const mockContract = await deployContract(wallet, MockContract);
  await wallet.send(identity.address, parseEther('1.0'));
  await mockToken.transfer(identity.address, parseEther('1.0'));
  return {publicKey, privateKey, keyAsAddress, identity, mockToken, mockContract};
}

export const transferMessage = {
  to: '0x0000000000000000000000000000000000000001',
  value: parseEther('1.0'),
  data: [],
  nonce: 0,
  gasPrice: 0,
  gasLimit: 0,
  gasToken: '0x0000000000000000000000000000000000000000'
};
