import {expect} from 'chai';
import ENSRegisteredUnderTests from '../../build/ENSRegisteredUnderTests';
import {loadFixture} from 'ethereum-waffle';
import {utils, Contract} from 'ethers';
import {lookupAddress} from '../utils';
import {basicENS} from '@universal-login/commons/testutils';
import {getDeployTransaction} from '@universal-login/commons';


const domain = 'mylogin.eth';
const label = 'alex';
const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
const name = `${label}.${domain}`;
const node = utils.namehash(name);
const hashDomain = utils.namehash(domain);

describe('ENSRegistered', async () => {
  let provider;
  let wallet;
  let ensRegisteredContract;
  let publicResolver;
  let registrarAddress;
  let ensAddress;
  let args;

  beforeEach(async () => {
    ({provider, publicResolver, registrarAddress, ensAddress, wallet} = await loadFixture(basicENS));
    args = [hashLabel, name, node, hashDomain, ensAddress];
    const deployTransaction = getDeployTransaction(ENSRegisteredUnderTests);
    const transaction = await wallet.sendTransaction(deployTransaction);
    const receipt = await provider.getTransactionReceipt(transaction.hash);
    console.log('deploy ', receipt.gasUsed.toString())
    ensRegisteredContract = new Contract(receipt.contractAddress, ENSRegisteredUnderTests.interface, wallet);
  });

  it('resolves to given address', async () => {
    const transaction = await ensRegisteredContract.registerENSUnderTests(...args);
    const receipt = await provider.getTransactionReceipt(transaction.hash);
    console.log('register ', receipt.gasUsed.toString())
    expect(await provider.resolveName(name)).to.eq(ensRegisteredContract.address);
    expect(await lookupAddress(provider, ensRegisteredContract.address, publicResolver)).to.eq(name);
  });
});
