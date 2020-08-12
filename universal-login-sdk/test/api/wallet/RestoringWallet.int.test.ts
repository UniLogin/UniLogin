import {expect} from 'chai';
import {RestoringWallet} from '../../../src/api/wallet/RestoringWallet';
import {TEST_ENCRYPTED_WALLET_JSON, TEST_CONTRACT_ADDRESS, SerializableRestoringWallet, TEST_WALLET, TEST_PASSWORD} from '@unilogin/commons';

describe('INT: RestoringWallet', () => {
  let restoringWallet: RestoringWallet;
  const ensName = 'name.mylogin.eth';

  before(async () => {
    restoringWallet = new RestoringWallet(TEST_ENCRYPTED_WALLET_JSON, ensName, TEST_CONTRACT_ADDRESS);
  });

  it('asSerializable returns proper wallet', () => {
    const expectedRestoringWallet: SerializableRestoringWallet = {
      encryptedWallet: TEST_ENCRYPTED_WALLET_JSON,
      contractAddress: TEST_CONTRACT_ADDRESS,
      ensName,
    };
    expect(restoringWallet.asSerializableRestoringWallet).to.deep.eq(expectedRestoringWallet);
  });

  it('restore returns deployed wallet', async () => {
    expect(await restoringWallet.restore(TEST_PASSWORD)).to.deep.eq(TEST_WALLET.privateKey);
  });
});
