import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {utils} from 'ethers';
import Identity from 'universal-login-contracts/build/Identity';
import {MANAGEMENT_KEY, ACTION_KEY} from 'universal-login-contracts';
import calculateMessageSignature, {waitForContractDeploy, addressToBytes32} from '../../../lib/utils/utils';
import TestHelper from 'universal-login-contracts/test/testHelper';
import basicIdentityService, {transferMessage, addKeyMessage, removeKeyMessage} from '../../fixtures/basicIdentityService';

chai.use(require('chai-string'));
chai.use(sinonChai);


describe('Relayer - IdentityService', async () => {
  const testHelper = new TestHelper();
  let identityService;
  let provider;
  let authorisationService;
  let wallet;
  let callback;
  let mockToken;
  let contract;
  let transaction;
  let msg;
  let otherWallet;

  beforeEach(async () => {
    ({wallet, provider, identityService, callback, mockToken, authorisationService, otherWallet} = await testHelper.load(basicIdentityService));
    transaction = await identityService.create(wallet.address, 'alex.mylogin.eth');
    contract = await waitForContractDeploy(wallet, Identity, transaction.hash);
    msg = {...transferMessage, from: contract.address, gasToken: mockToken.address};
    await wallet.send(contract.address, utils.parseEther('1.0'));
    await mockToken.transfer(contract.address, utils.parseEther('1.0'));
  });

  describe('Create', async () => {
    it('returns contract address', async () => {
      expect(contract.address).to.be.properAddress;
    });

    it('is initialized with management key', async () => {
      const managementKeys = await contract.getKeysByPurpose(MANAGEMENT_KEY);
      const expectedKey = wallet.address.slice(2).toLowerCase();
      expect(managementKeys).to.have.lengthOf(1);
      expect(managementKeys[0]).to.endsWith(expectedKey);
    });

    it('has ENS name reserved', async () => {
      expect(await provider.resolveName('alex.mylogin.eth')).to.eq(contract.address);
    });

    it('should emit created event', async () => {
      expect(callback).to.be.calledWith(sinon.match(transaction));
    });
  });

  describe('Execute signed', async () => {
    it('Error when not enough tokens', async () => {
      const signature = calculateMessageSignature(wallet, {...msg, value: utils.parseEther('100')});
      expect(identityService.executeSigned(contract.address, {...msg, signature})).to.be.eventually.rejected;
    });

    describe('Transfer', async () => {
      it('successful execution of transfer', async () => {
        const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
        const signature = calculateMessageSignature(wallet, msg);
        await identityService.executeSigned(contract.address, {...msg, signature});
        expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
      });
    });

    describe('Add Key', async () => {
      it('execute add key', async () => {
        msg = {...addKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
        const signature = calculateMessageSignature(wallet, msg);

        await identityService.executeSigned(contract.address, {...msg, signature});
        const key = await contract.getKey(addressToBytes32(otherWallet.address));
        expect(key.purpose).to.eq(ACTION_KEY);
      });

      describe('Collaboration with Authorisation Service', async () => {
        it('should remove request from pending authorisations if addKey', async () => {
          const request = {identityAddress: contract.address, key: otherWallet.address, label: 'lol'};
          await authorisationService.addRequest(request);
          msg = {...addKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
          const signature = calculateMessageSignature(wallet, msg);
          
          await identityService.executeSigned(contract.address, {...msg, signature});
          expect(await authorisationService.getPendingAuthorisations(contract.address)).to.deep.eq([]);
        });
      });
    });

    describe('Remove key ', async () => {
      beforeEach(async () => {
        const message =  {...addKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
        const signature = calculateMessageSignature(wallet, message);
        
        await identityService.executeSigned(contract.address, {...message, signature});
      });

      it('should remove key', async () => {
        expect((await contract.getKey(addressToBytes32(otherWallet.address)))[0]).to.eq(ACTION_KEY);
        const message =  {...removeKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
        const signature = calculateMessageSignature(wallet, message);
        
        await identityService.executeSigned(contract.address, {...message, signature});
        expect((await contract.getKey(addressToBytes32(otherWallet.address)))[0]).to.eq(0);
      });
    });
  });
});
