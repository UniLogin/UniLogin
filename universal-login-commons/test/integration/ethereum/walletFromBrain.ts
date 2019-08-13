import {expect} from 'chai';
import {Wallet} from 'ethers';
import {walletFromBrain} from '../../../lib';

describe('INT: walletFromBrain', () => {
  const privateKey = '0x61dcd0852d1aec0bf1362e02a0061c2ddbfba7c46366c2b83fd79a48ee300ace';
  const name = 'name.mylogin.eth';
  const passphrase = 'ik-akainy-vom-zazoji-juynuo';

  it('return correct wallet', async () => {
    const expectedWallet = new Wallet(privateKey);
    expect(await walletFromBrain(name, passphrase)).to.be.deep.eq(expectedWallet);
  });
});
