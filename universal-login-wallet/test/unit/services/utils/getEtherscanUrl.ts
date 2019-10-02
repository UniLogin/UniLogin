import {expect} from 'chai';
import {getEtherscanUrl} from '../../../../src/core/utils/getEtherscanUrl';
import {HashZero} from 'ethers/constants';

describe('UNIT: getEtherscanUrl', () => {
  it('Empty transaction hash', () => {
    expect(() => getEtherscanUrl('', HashZero)).to.throw('Invalid chain name');
  });

  it('Testnet', () => {
    expect(getEtherscanUrl('rinkeby', HashZero)).to.eq(`https://rinkeby.etherscan.io/tx/${HashZero}`);
  });

  it('Testnet, unformatted name passed', () => {
    expect(getEtherscanUrl('Ropsten ', HashZero)).to.eq(`https://ropsten.etherscan.io/tx/${HashZero}`);
  });

  it('Mainnet', () => {
    expect(getEtherscanUrl('mainnet', HashZero)).to.eq(`https://etherscan.io/tx/${HashZero}`);
  });
});
