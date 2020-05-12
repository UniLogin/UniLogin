import chai, {expect} from 'chai';
import chaiHttp from 'chai-http';
import {Contract, Wallet} from 'ethers';
import {KeyPair, TEST_GAS_PRICE, ETHER_NATIVE_TOKEN} from '@unilogin/commons';
import {createFutureWallet} from '../testhelpers/setupWalletService';
chai.use(chaiHttp);

export const createFutureWalletAndPost = async (relayerUrl: string, keyPair: KeyPair, ensName: string, factoryContract: Contract, relayerWallet: Wallet, ensAddress: string, ensRegistrarAddress: string, gnosisSafeAddress: string, fallbackHandlerAddress: string, gasPrice = TEST_GAS_PRICE, gasToken = ETHER_NATIVE_TOKEN.address) => {
  const {signature, contractAddress} = await createFutureWallet(keyPair, ensName, factoryContract, relayerWallet, ensAddress, ensRegistrarAddress, gnosisSafeAddress, fallbackHandlerAddress, gasPrice, gasToken);
  const {status, body} = await chai.request(relayerUrl).post('/wallet/future').send({
    contractAddress,
    gasToken,
    gasPrice,
    publicKey: keyPair.publicKey,
    ensName,
  });
  expect(status).to.eq(201, `createFutureWalletAndPost failed: ${body.error}`);
  return {signature, contractAddress};
};
