import {expect} from 'chai';
import {utils} from 'ethers';
import {EMPTY_ACCOUNT_ADDRESS, waitUntil, sleep, defaultDeployOptions} from '@universal-login/commons';
import {parseTransactionParametersToBigNumber, parseTransactionParametersToString} from '../../lib/utils/parseTransaction';

describe('UNIT: Parsing Transaction', () => {
  const transaction: Partial<utils.Transaction> = {
    to: EMPTY_ACCOUNT_ADDRESS,
    value: utils.parseEther('2'),
    gasLimit: utils.bigNumberify(3500000),
    gasPrice: utils.bigNumberify(9000000000),
  };
  const parsedTransaction = {
    to: EMPTY_ACCOUNT_ADDRESS,
    value: '2000000000000000000',
    gasLimit: '3500000',
    gasPrice: '9000000000',
  };

  it('should parse BigNumber to string', () => {
    expect(parseTransactionParametersToString(transaction)).to.deep.equal(parsedTransaction);
  });

  it('should parse string to BigNumber', () => {
    expect(parseTransactionParametersToBigNumber(parsedTransaction)).to.deep.equal(transaction);
  });
});
