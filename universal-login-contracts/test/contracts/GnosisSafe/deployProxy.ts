import {expect} from 'chai';
import {providers, Wallet, Contract, utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {loadFixture, deployContract} from 'ethereum-waffle';
import {createKeyPair, ETHER_NATIVE_TOKEN, removeHexStringPrefix} from '@universal-login/commons';
import {basicENS} from '@universal-login/commons/testutils';
import {deployGnosisSafe, deployProxyFactory} from '../../../src/gnosis-safe@1.1.1/deployContracts';
import {encodeDataForSetup} from '../../../src/gnosis-safe@1.1.1/encode';
import {computeGnosisCounterfactualAddress} from '../../../src/gnosis-safe@1.1.1/utils';
import ENSUtils from '../../../build/TestableENSUtils.json';

describe('GnosisSafe', async () => {
  const domain = 'mylogin.eth';
  const label = 'alex';
  const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
  const name = `${label}.${domain}`;
  const node = utils.namehash(name);
  let provider: providers.Provider;
  let wallet: Wallet;
  let gnosisSafe: Contract;
  let proxyFactory: Contract;
  let ensAddress: string;
  let registrarAddress: string;
  let publicResolver: string;
  const keyPair = createKeyPair();

  before(async () => {
    ({wallet, publicResolver, registrarAddress, ensAddress, provider} = await loadFixture(basicENS));
    gnosisSafe = await deployGnosisSafe(wallet);
    proxyFactory = await deployProxyFactory(wallet);
  });

  it('deploys proxy and registers ENS name', async () => {
    const ensRegistrar = await deployContract(wallet, ENSUtils as any);
    const args = [hashLabel, name, node, ensAddress, registrarAddress, publicResolver];
    const data = new utils.Interface(ENSUtils.interface as any).functions.registerENSUnderTests.encode(args);
    const deployment = {
      owners: [keyPair.publicKey],
      requiredConfirmations: 1,
      deploymentCallAddress: ensRegistrar.address,
      deploymentCallData: data,
      fallbackHandler: AddressZero,
      paymentToken: ETHER_NATIVE_TOKEN.address,
      payment: '0',
      refundReceiver: wallet.address,
    };
    const setupData = encodeDataForSetup(deployment);
    const computedAddress = computeGnosisCounterfactualAddress(proxyFactory.address, 0, setupData, gnosisSafe.address);
    const transaction = await proxyFactory.createProxyWithNonce(gnosisSafe.address, setupData, 0);
    const receipt = await provider.getTransactionReceipt(transaction.hash);
    const addressFromEvent = receipt.logs && receipt.logs[0].data;
    expect(addressFromEvent).to.include(removeHexStringPrefix(computedAddress).toLowerCase());
    expect(await provider.lookupAddress(computedAddress)).to.eq(name);
    expect(await provider.resolveName('alex.mylogin.eth')).to.eq(computedAddress);
  });
});
