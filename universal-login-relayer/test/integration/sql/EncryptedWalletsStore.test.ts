import {getKnexConfig} from '../../testhelpers/knex';
import {EncryptedWalletsStore} from '../../../src/integration/sql/services/EncryptedWalletsStore';
import {EncryptedWallet} from '@unilogin/commons';
import {expect} from 'chai';

const mockedEncryptedWalletJson = '{"address":"92f5c785e41b17cd0148d74996ffaff1c110004e","id":"6c0d1181-317e-4d66-afc2-df013207951e","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"c6461a01089b6b6f8ca19b0d4b10721f"},"ciphertext":"8eaab45a8ff35a66d17b9e8d467672b8d74a71c84c0cb4b4f300b3b5668b64fc","kdf":"scrypt","kdfparams":{"salt":"a64545363f10693c2a895447b5b6e9af1554cf4f9b4c513acb4e3040956f096d","n":1048576,"dklen":32,"p":1,"r":8},"mac":"3ce5e7cedcb6c4699d9eca0f71bdb4d734231882961568fb053635da1686f6e6"},"x-ethers":{"client":"ethers.js","gethFilename":"UTC--2020-07-09T11-47-07.0Z--92f5c785e41b17cd0148d74996ffaff1c110004e","mnemonicCounter":"43d996ad225ceef4ab068cb170ea0255","mnemonicCiphertext":"a96c6296afe4332d536f03fb48ec51c0","path":"m/44\'/60\'/0\'/0/0","version":"0.1"}}';

describe('UNIT: EncryptedWalletsStore', () => {
  const knex = getKnexConfig();
  const encryptedWalletsStore = new EncryptedWalletsStore(knex);

  it('Should add encryptedWallet to database and get it from it', async () => {
    const exampleEmail = 'encryptedWallet@email.com';
    const encryptedWallets: EncryptedWallet = {
      walletJSON: mockedEncryptedWalletJson,
      email: exampleEmail,
      ensName: 'bob.unilogin.eth',
    };

    const email = await encryptedWalletsStore.add(encryptedWallets);
    expect(email).be.deep.eq(exampleEmail);
    expect(await encryptedWalletsStore.get(email)).be.deep.eq(encryptedWallets);
  });
});
