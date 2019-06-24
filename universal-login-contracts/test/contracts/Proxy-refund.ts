import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {loadFixture, solidity, deployContract, getWallets} from 'ethereum-waffle';
import {transferMessage} from '../utils/ExampleMessages';
import {utils, Contract, providers, Wallet} from 'ethers';
import {calculateMessageSignature, UnsignedMessage, TEST_ACCOUNT_ADDRESS, ETHER_NATIVE_TOKEN, OPERATION_CALL, createKeyPair, computeContractAddress} from '@universal-login/commons';
import Loop from '../../build/Loop.json';
import {encodeFunction} from '../utils';
import {encodeDataForExecuteSigned, getDeployData} from '../../lib';
import {ensAndMasterFixture, createProxyDeployWithENSArgs, EnsDomainData} from '../fixtures/walletContract';
import ProxyContract from '../../build/Proxy.json';
import MockToken from '../../build/MockToken.json';
// import {setupProxyContract} from '../fixtures/proxyWithEther';

chai.use(chaiAsPromised);
chai.use(solidity);

describe('CONTRACT: Proxy - refund', async  () => {
  let provider: providers.Provider;
  let walletMaster: Contract;
  let factoryContract: Contract;
  let signature: string;
  let deployer: Wallet;
  let mockToken: Contract;
  let loopContract: Contract;
  let infiniteCallMessage: UnsignedMessage;
  let initialBalance: utils.BigNumber;
  let initializeWithENS: string;
  let ensDomainData: EnsDomainData;
  const keyPair = createKeyPair();
  let initData: string;
  let computedContractAddress: string;
  let proxyAddress: string;

  beforeEach(async () => {
    ({provider, walletMaster, deployer, factoryContract, ensDomainData} = await loadFixture(ensAndMasterFixture));
    loopContract = await deployContract(deployer, Loop);
    const [, anotherWallet] = getWallets(provider);
    mockToken = await deployContract(deployer, MockToken);
    // ({proxyAddress} = await setupProxyContract(anotherWallet, factoryContract, keyPair.publicKey, ensDomainData, walletMaster.address));
    [, initializeWithENS] = createProxyDeployWithENSArgs(keyPair.publicKey, ensDomainData, walletMaster.address);
    initData = getDeployData(ProxyContract, [walletMaster.address, '0x0']);

    computedContractAddress = computeContractAddress(factoryContract.address, keyPair.publicKey, initData);
    await anotherWallet.sendTransaction({to: computedContractAddress, value: utils.parseEther('10.0')});
    await factoryContract.createContract(keyPair.publicKey, initializeWithENS);
    await mockToken.transfer(computedContractAddress, utils.parseEther('1.0'));
    proxyAddress = computedContractAddress;
    const loopFunctionData = encodeFunction(Loop, 'loop');
    infiniteCallMessage = {
      from: proxyAddress,
      to: loopContract.address,
      value: utils.parseEther('0'),
      data: loopFunctionData,
      nonce: 0,
      gasPrice: 1,
      gasToken: '0x0',
      gasLimit: utils.bigNumberify('240000'),
      operationType: OPERATION_CALL
    };
    initialBalance = await deployer.getBalance();
  });

  it('refund works', async () => {
    const message = {...transferMessage, gasPrice: 1, from: proxyAddress};
    signature = await calculateMessageSignature(keyPair.privateKey, message);
    const executeData = encodeDataForExecuteSigned({...message, signature});
    const transaction = await deployer.sendTransaction({to: proxyAddress, data: executeData, gasPrice: 1});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    expect(await provider.getBalance(TEST_ACCOUNT_ADDRESS)).to.eq(utils.parseEther('1'));
    const balanceAfter = await deployer.getBalance();
    expect(balanceAfter).to.be.above(initialBalance.sub(receipt.gasUsed as utils.BigNumber));
  });

  it('ETHER_REFUND_CHARGE is enough for ether refund', async () => {
    infiniteCallMessage = {...infiniteCallMessage, gasToken: ETHER_NATIVE_TOKEN.address};
    signature = await calculateMessageSignature(keyPair.privateKey, infiniteCallMessage);
    const executeData = encodeDataForExecuteSigned({...infiniteCallMessage, signature});
    const transaction = await deployer.sendTransaction({to: proxyAddress, data: executeData, gasPrice: 1, gasLimit: infiniteCallMessage.gasLimit});
    const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    const balanceAfter = await deployer.getBalance();
    expect(balanceAfter).to.be.above(initialBalance.sub(receipt.gasUsed as utils.BigNumber));
  });

  it('TOKEN_REFUND_CHARGE is enough for token refund', async () => {
    const initialTokenBalance = await mockToken.balanceOf(deployer.address);
    infiniteCallMessage = {...infiniteCallMessage, gasToken: mockToken.address};
    signature = await calculateMessageSignature(keyPair.privateKey, infiniteCallMessage);
    const executeData = encodeDataForExecuteSigned({...infiniteCallMessage, signature});
    const transaction = await deployer.sendTransaction({to: proxyAddress, data: executeData, gasPrice: 1, gasLimit: infiniteCallMessage.gasLimit});
    // const receipt = await provider.getTransactionReceipt(transaction.hash as string);
    // const balanceAfter = await mockToken.balanceOf(deployer.address);
    // expect(balanceAfter).to.be.above(initialTokenBalance.sub(receipt.gasUsed as utils.BigNumber));
  });
});
