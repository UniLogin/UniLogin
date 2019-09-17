import chai, {expect} from 'chai';
import {SignedMessage} from '@universal-login/commons';
import {ComposeValidator} from '../../../../lib/core/services/validators/ComposeValidator';
import {IMessageValidator} from '../../../../lib/core/services/validators/IMessageValidator';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('UNIT: ComposeValidator', () => {
  const passingValidator: IMessageValidator = { validate: async () => {} };
  const createFailingValidator = (errorMsg: string) => ({ validate: async () => {throw new Error(errorMsg); } } as IMessageValidator);
  const message: SignedMessage = {
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

  it('ComposeValidator should pass if individual validators pass', () => {
    const composeValidator = new ComposeValidator([passingValidator, passingValidator]);
    expect(() => composeValidator.validate(message)).to.not.throw;
  });

  it('ComposeValidator should fail if one individual validator fails', async () => {
    const composeValidator = new ComposeValidator(
      [passingValidator, createFailingValidator('validation error')]
    );

    await expect(composeValidator.validate(message)).to.be.eventually.rejectedWith('validation error');
  });

  it('ComposeValidator should fail with first error if many individual validators fail', async () => {
    const composeValidator = new ComposeValidator(
      [createFailingValidator('first validation error'), createFailingValidator('second validation error')]
    );

    await expect(composeValidator.validate(message)).to.be.eventually.rejectedWith('first validation error');
  });
});
