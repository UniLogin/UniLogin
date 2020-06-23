import {GAS_FIXED, OperationType, SignedMessage, ProviderService} from '@unilogin/commons';
import {ContractService} from '@unilogin/contracts';
import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {utils} from 'ethers';
import {AddressZero} from 'ethers/constants';
import {GasComputation} from '../../../../src/core/services/GasComputation';
import {GasValidator} from '../../../../src/core/services/validators/GasValidator';

chai.use(chaiAsPromised);

describe('UNIT: GasValidator', () => {
  const MAX_GAS_LIMIT = 500000;
  const mockedContractService = {
    fetchWalletVersion: (address: string) => 'beta2',
  } as any as ContractService;
  const mockedProviderService = {
    fetchHardforkVersion: () => new Promise(resolve => resolve('constantinople')),
  } as any as ProviderService;
  const gasComputation = new GasComputation(mockedContractService, mockedProviderService);
  const gasValidator = new GasValidator(MAX_GAS_LIMIT, gasComputation);
  let message: SignedMessage;
  const baseGas = utils.bigNumberify(11408).add(GAS_FIXED);

  beforeEach(() => {
    message = {
      to: '0xa3697367b0e19F6E9E3E7Fa1bC8b566106C68e1b',
      value: 0,
      data: '0x5f7b68be00000000000000000000000063fc2ad3d021a4d7e64323529a55a9442c444da0',
      nonce: 0,
      operationType: OperationType.call,
      refundReceiver: AddressZero,
      gasPrice: 10000000000,
      baseGas,
      safeTxGas: utils.bigNumberify(MAX_GAS_LIMIT).sub(baseGas),
      gasToken: '0xFDFEF9D10d929cB3905C71400ce6be1990EA0F34',
      from: '0xa3697367b0e19F6E9E3E7Fa1bC8b566106C68e1b',
      signature: '0x0302cfd70e07e8d348e2b84803689fc44c1393ad6f02be5b1f2b4747eebd3d180ebfc4946f7f51235876313a11596e0ee55cd692275ca0f0cc30d79f5fba80e01b',
    };
  });

  it('just about right', async () => {
    await expect(gasValidator.validate(message)).to.be.eventually.fulfilled;
  });

  it('too less', async () => {
    const actualBaseGas = await gasComputation.calculateBaseGas(message);
    message.baseGas = (message.baseGas as utils.BigNumber).sub(1);
    await expect(gasValidator.validate(message)).to.be.eventually.rejectedWith(`Insufficient Gas. Got baseGas ${message.baseGas} but should be ${actualBaseGas}`);
  });

  it('gas limit too high', async () => {
    message.safeTxGas = (message.safeTxGas as utils.BigNumber).add(1);
    await expect(gasValidator.validate(message)).to.be.eventually.rejectedWith(`GasLimit is too high. Got ${MAX_GAS_LIMIT + 1} but should be less than ${MAX_GAS_LIMIT}`);
  });
});
