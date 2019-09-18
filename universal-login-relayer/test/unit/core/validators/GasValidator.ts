import chai, {expect} from 'chai';
import {SignedMessage} from '@universal-login/commons';
import {estimateGasDataFromSignedMessage} from '@universal-login/contracts';
import {GasValidator} from '../../../../lib/core/services/validators/GasValidator';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('UNIT: GasValidator', () => {
  const gasValidator = new GasValidator();
  let message: SignedMessage;

  beforeEach(() => {
    message = {
      to: '0xa3697367b0e19F6E9E3E7Fa1bC8b566106C68e1b',
      value: 0,
      data: '0x5f7b68be00000000000000000000000063fc2ad3d021a4d7e64323529a55a9442c444da0',
      nonce: 0,
      gasPrice: 10000000000,
      gasData: 11408,
      gasLimitExecution: 1000000 - 11408,
      gasToken: '0xFDFEF9D10d929cB3905C71400ce6be1990EA0F34',
      from: '0xa3697367b0e19F6E9E3E7Fa1bC8b566106C68e1b',
      signature: '0x0302cfd70e07e8d348e2b84803689fc44c1393ad6f02be5b1f2b4747eebd3d180ebfc4946f7f51235876313a11596e0ee55cd692275ca0f0cc30d79f5fba80e01b'
    };
  });

  it('just about right', () => {
    expect(gasValidator.validate(message)).to.be.eventually.fulfilled;
  });

  it('too less', () => {
    (message.gasData as number) -= 1;
    const actualGasData = estimateGasDataFromSignedMessage(message);
    expect(gasValidator.validate(message)).to.be.eventually.rejectedWith(`Insufficient Gas. gasData: got ${message.gasData as number} but should be ${actualGasData}`);
  });
});
