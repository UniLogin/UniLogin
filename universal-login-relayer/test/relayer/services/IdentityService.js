import chai, {expect} from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {utils} from 'ethers';
import {MANAGEMENT_KEY, ACTION_KEY} from 'universal-login-contracts';
import {addressToBytes32} from '../../../lib/utils/utils';
import calculateMessageSignature from 'universal-login-contracts/lib/calculateMessageSignature';
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
  let msg;
  let otherWallet;

  beforeEach(async () => {
    ({wallet, provider, identityService, callback, mockToken, authorisationService, contract, otherWallet} = await testHelper.load(basicIdentityService));
    msg = {...transferMessage, from: contract.address, gasToken: mockToken.address};
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
      const transaction = await identityService.create(wallet.address, 'example.mylogin.eth');
      expect(callback).to.be.calledWith(sinon.match(transaction));
    });

    it('should fail with not existing ENS name', async () => {
      const managementKeys = await contract.getKeysByPurpose(MANAGEMENT_KEY);
      expect(managementKeys).to.have.lengthOf(1);
      await expect(identityService.create(managementKeys[0], 'alex.non-existing-id.eth')).to.be.eventually.rejectedWith('domain not existing / not universal ID compatible');
    });
  });

  describe('Execute signed', async () => {
    it('Error when not enough tokens', async () => {
      const message = {...msg, gasLimit: utils.parseEther('2.0')};
      const signature = calculateMessageSignature(wallet.privateKey, message);
      expect(identityService.executeSigned(contract.address, {...message, signature})).to.be.eventually.rejectedWith('Not enough tokens');
    });

    describe('Transfer', async () => {
      it('successful execution of transfer', async () => {
        const expectedBalance = (await provider.getBalance(msg.to)).add(msg.value);
        const signature = calculateMessageSignature(wallet.privateKey, msg);
        await identityService.executeSigned(contract.address, {...msg, signature});
        expect(await provider.getBalance(msg.to)).to.eq(expectedBalance);
      });
    });

    describe('Add Key', async () => {
      it('execute add key', async () => {
        msg = {...addKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
        const signature = calculateMessageSignature(wallet.privateKey, msg);

        await identityService.executeSigned(contract.address, {...msg, signature});
        const key = await contract.getKey(addressToBytes32(otherWallet.address));
        expect(key.purpose).to.eq(ACTION_KEY);
      });

      describe('Collaboration with Authorisation Service', async () => {
        it('should remove request from pending authorisations if addKey', async () => {
          const request = {identityAddress: contract.address, key: otherWallet.address, label: 'lol'};
          await authorisationService.addRequest(request);
          msg = {...addKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
          const signature = calculateMessageSignature(wallet.privateKey, msg);
          
          await identityService.executeSigned(contract.address, {...msg, signature});
          expect(await authorisationService.getPendingAuthorisations(contract.address)).to.deep.eq([]);
        });
      });
    });

    describe('Remove key ', async () => {
      beforeEach(async () => {
        const message =  {...addKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
        const signature = calculateMessageSignature(wallet.privateKey, message);
        
        await identityService.executeSigned(contract.address, {...message, signature});
      });

      it('should remove key', async () => {
        expect((await contract.getKey(addressToBytes32(otherWallet.address)))[0]).to.eq(ACTION_KEY);
        const message =  {...removeKeyMessage, from: contract.address, gasToken: mockToken.address, to: contract.address};
        const signature = calculateMessageSignature(wallet.privateKey, message);
        
        await identityService.executeSigned(contract.address, {...message, signature});
        expect((await contract.getKey(addressToBytes32(otherWallet.address)))[0]).to.eq(0);
      });
    });
  });
});
