import chai, {expect} from 'chai';
import {utils, Wallet, Contract} from 'ethers';
import {getWallets, solidity, deployContract, createMockProvider} from 'ethereum-waffle';
import {calculateMessageSignature, concatenateSignatures, ACTION_KEY, OPERATION_CALL, TEST_ACCOUNT_ADDRESS} from '@universal-login/commons';
import ERC1077 from '@universal-login/contracts/build/ERC1077.json';
import PendingExecution from '../../lib/utils/pendingExecution';
import defaultPaymentOptions from '../../lib/config/defaultPaymentOptions';

chai.use(solidity);

const {gasPrice, gasLimit} = defaultPaymentOptions;

const baseMsg: any = {
  to: TEST_ACCOUNT_ADDRESS,
  value: utils.parseEther('0.5'),
  data: utils.formatBytes32String('0x0'),
  nonce: 0,
  gasPrice,
  gasLimit,
  gasToken: '0x0000000000000000000000000000000000000000',
  operationType: OPERATION_CALL,
};

describe('Pending Execution', async () => {
    const sampleTx = '0x0cd49580e0e003e50dc47059bc2001f378d260ab0d8f61cdb8c4421f3635ff6d';
    const provider = createMockProvider();
    const [, , wallet] = getWallets(provider);
    let walletContract: Contract;
    let pendingExecution: PendingExecution;
    let actionPrivateKey: string;
    let actionAddress: string;
    let signature0: string;
    let signature1: string;
    let msg0: any;
    let msg1: any;
    let invalidMsg: any;
    let status: any;

    beforeEach(async () => {
        walletContract = await deployContract(wallet, ERC1077, [wallet.address]);
        const actionWallet = Wallet.createRandom();
        actionPrivateKey = actionWallet.privateKey;
        actionAddress = actionWallet.address;
        pendingExecution = new PendingExecution(walletContract.address, wallet);
        await walletContract.addKey(actionWallet.address, ACTION_KEY);
        await walletContract.setRequiredSignatures(2);
        signature0 = await calculateMessageSignature(wallet.privateKey, {...baseMsg, from: walletContract.address});
        signature1 = await calculateMessageSignature(actionPrivateKey, {...baseMsg, from: walletContract.address});
        const invalidSignature = await calculateMessageSignature(actionPrivateKey, {...baseMsg, from: wallet.address});
        msg0 = {...baseMsg, from: walletContract.address, signature: signature0};
        msg1 = {...baseMsg, from: walletContract.address, signature: signature1};
        invalidMsg = {...baseMsg, from: walletContract.address, signature: invalidSignature};
    });

    describe('should be correctly initialized', async () => {
        let status: any;

        beforeEach(async () => {
            status = await pendingExecution.getStatus();
        });

        it('should start with correct number of collected signatures', async () => {
            expect(status.totalCollected).to.be.eq(0);
        });

        it('should start with no collected signatures', async () => {
            expect(status.collectedSignatures.length).to.be.eq(0);
        });

        it('should get correct number of required signatures', async () => {
            expect(status.required).to.be.eq(2);
        });

        it('should get correct number of required signatures', async () => {
            expect(status.transactionHash).to.be.eq('0x0');
        });
    });

    describe('Push', async () => {

        it('should push one signature', async () => {
            await pendingExecution.push(msg0);
            status = await pendingExecution.getStatus();
            const {collectedSignatures} = status;
            expect(status.collectedSignatures.length).to.be.eq(1);
            expect(collectedSignatures[0]).to.be.eq(signature0);
        });

        it('should push two signatures', async () => {
            await pendingExecution.push(msg0);
            await pendingExecution.push(msg1);
            status = await pendingExecution.getStatus();
            const {collectedSignatures} = status;
            expect(status.collectedSignatures.length).to.be.eq(2);
            expect(collectedSignatures).to.deep.eq([signature0, signature1]);
        });

        it('should not push invalid key purpose', async () => {
            await expect(pendingExecution.push(invalidMsg))
                .to.be.rejectedWith('Invalid key purpose');
        });

        it('should not accept same signature twice', async () => {
            await pendingExecution.push(msg0);
            await expect(pendingExecution.push(msg0))
                .to.be.rejectedWith('Signature already collected');
        });

        it('should not accept same signature twice', async () => {
            await walletContract.setRequiredSignatures(1);
            await pendingExecution.push(msg0);
            await pendingExecution.confirmExecution(sampleTx);
            await expect(pendingExecution.push(msg1))
                .to.be.rejectedWith('Execution request already processed');
        });
    });

    describe('Concatenate', async () => {
        it('should concatenate two signatures', async () => {
            await pendingExecution.push(msg0);
            await pendingExecution.push(msg1);
            status = await pendingExecution.getStatus();
            const concatenatedSignatures = pendingExecution.getConcatenatedSignatures();
            let expected: string;
            if (utils.bigNumberify(wallet.address).lt(utils.bigNumberify(actionAddress))) {
                expected = concatenateSignatures([signature0, signature1]);
            } else {
                expected = concatenateSignatures([signature1, signature0]);
            }
            await expect(concatenatedSignatures).to.be.eq(expected);
        });
    });

    describe('Confirm', async () => {
        it('should confirm', async () => {
            await pendingExecution.push(msg0);
            await pendingExecution.push(msg1);
            await pendingExecution.confirmExecution(sampleTx);
            status = await pendingExecution.getStatus();
            expect(status.transactionHash).to.be.eq(sampleTx);
        });

        it('should not confirm with not enough signatures', async () => {
            await pendingExecution.push(msg0);
            await expect(pendingExecution.ensureCorrectExecution())
                .to.be.rejectedWith('Not enough signatures');
        });

        it('should not confirm if tx is already confirmed', async () => {
            await pendingExecution.push(msg0);
            await pendingExecution.push(msg1);
            await pendingExecution.confirmExecution(sampleTx);
            await expect(pendingExecution.ensureCorrectExecution())
                .to.be.rejectedWith('Transaction 0x0 has already been confirmed');
        });

        it('should not confirm with invalid tx', async () => {
            await pendingExecution.push(msg0);
            await pendingExecution.push(msg1);
            await expect(pendingExecution.confirmExecution('0x0'))
                .to.be.rejectedWith('Invalid transaction: 0x0');
        });
    });
});