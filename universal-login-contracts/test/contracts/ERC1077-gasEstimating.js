import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from 'ethereum-waffle';
import basicIdentity, {transferMessage} from '../fixtures/basicIdentity';
import ethers, {utils} from 'ethers';
import {OPERATION_CALL} from 'universal-login-contracts/lib/consts';
import TestHelper from '../testHelper';
import calculateMessageSignature from '../../lib/calculateMessageSignature';

chai.use(chaiAsPromised);
chai.use(solidity);

const {parseEther} = utils;
const to = '0x0000000000000000000000000000000000000001';
const ETHER = '0x0000000000000000000000000000000000000000';

describe('ERC1077 - gas estimating', async () => {
  const testHelper = new TestHelper();
  let provider;
  let identity;
  let privateKey;
  let signature;
  let msg;
  let mockContract;
  let wallet;

  beforeEach(async () => {
    ({provider, identity, privateKey, mockContract} = await testHelper.load(basicIdentity));
    msg = {...transferMessage, from: identity.address};
    signature = calculateMessageSignature(privateKey, msg);
    wallet = new ethers.Wallet(privateKey, provider);
  });

  describe('gas cost', () => {
    it('mock call costs', async () => {
      const callMockData = mockContract.interface.functions.callMe().data; 
      const msgToCall = {...transferMessage, from: identity.address, to: mockContract.address, data: callMockData, value: 0};
      const signatureToCall = calculateMessageSignature(privateKey, msgToCall);
      const {data} = identity.interface.functions.executeSigned(mockContract.address, 0, callMockData, 0, 0, ETHER, 0, OPERATION_CALL, signatureToCall);

      const transaction = {
        to: identity.address,
        data,
        value: 0
      };

      const sentTransaction = await wallet.sendTransaction(transaction); 

      console.log(`mock call costs: ${utils.formatEther((await provider.getTransactionReceipt(sentTransaction.hash)).gasUsed)}`);
    });

    it('transfer ether costs', async () => {
      const {data} = identity.interface.functions.executeSigned(to, parseEther('1.0'), [], 0, 0, ETHER, 0, OPERATION_CALL, signature);

      const transaction = {
        to: identity.address,
        data,
        value: 0
      };

      const sentTransaction = await wallet.sendTransaction(transaction); 

      console.log(`transfer ether costs: ${utils.formatEther((await provider.getTransactionReceipt(sentTransaction.hash)).gasUsed)}`);
    });
  });
});
