import {expect} from 'chai';
import {getEtherscanUrl} from '../../../../src/core/utils/getEtherscanUrl';

describe('UNIT: Get etherscan URL', () => {

  it('Return url for testnet', () => {
    expect(getEtherscanUrl('rinkeby', '0x123')).to.eq('https://rinkeby.etherscan.io/tx/0x123');
  });

  it('Return url for testnet when unformatted name passed', () => {
    expect(getEtherscanUrl('Ropsten ', '0x123')).to.eq('https://ropsten.etherscan.io/tx/0x123');
  });

  it('Return url for mainnet', () => {
    expect(getEtherscanUrl('mainnet', '0x123')).to.eq('https://etherscan.io/tx/0x123');
  });
});
