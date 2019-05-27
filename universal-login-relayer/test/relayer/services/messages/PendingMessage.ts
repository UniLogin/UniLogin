import chai, {expect} from 'chai';
import {utils, Wallet, Contract} from 'ethers';
import {getWallets, solidity, deployContract, createMockProvider} from 'ethereum-waffle';
import {calculateMessageSignature, concatenateSignatures, ACTION_KEY, OPERATION_CALL, TEST_ACCOUNT_ADDRESS, calculateMessageHash} from '@universal-login/commons';
import ERC1077 from '@universal-login/contracts/build/ERC1077.json';
import PendingMessage from '../../../../lib/services/messages/PendingMessage';
import defaultPaymentOptions from '../../../../lib/config/defaultPaymentOptions';
import {getKeyFromHashAndSignature} from '../../../../lib/utils/utils';

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
    const provider = createMockProvider();
    const [, , wallet] = getWallets(provider);
    let walletContract: Contract;
    let pendingMessage: PendingMessage;
    let actionPrivateKey: string;
    let actionAddress: string;
    let signature0: string;
    let signature1: string;
    let msg0: any;
    let msg1: any;
    let status: any;

    beforeEach(async () => {
        walletContract = await deployContract(wallet, ERC1077, [wallet.address]);
        const actionWallet = Wallet.createRandom();
        actionPrivateKey = actionWallet.privateKey;
        actionAddress = actionWallet.address;
        pendingMessage = new PendingMessage(walletContract.address, wallet);
        await walletContract.addKey(actionWallet.address, ACTION_KEY);
        await walletContract.setRequiredSignatures(2);
        signature0 = await calculateMessageSignature(wallet.privateKey, {...baseMsg, from: walletContract.address});
        signature1 = await calculateMessageSignature(actionPrivateKey, {...baseMsg, from: walletContract.address});
        msg0 = {...baseMsg, from: walletContract.address, signature: signature0};
        msg1 = {...baseMsg, from: walletContract.address, signature: signature1};
    });

    describe('should be correctly initialized', async () => {
        beforeEach(async () => {
            status = await pendingMessage.getStatus();
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

    describe('Concatenate', async () => {
        it('should concatenate two signatures', async () => {
            const key0 = getKeyFromHashAndSignature(calculateMessageHash(msg0), msg0.signature);
            const key1 = getKeyFromHashAndSignature(calculateMessageHash(msg1), msg1.signature);
            await pendingMessage.collectedSignatures.push({signature: msg0.signature, key: key0});
            await pendingMessage.collectedSignatures.push({signature: msg1.signature, key: key1});
            status = await pendingMessage.getStatus();
            const concatenatedSignatures = pendingMessage.getConcatenatedSignatures();
            let expected: string;
            if (utils.bigNumberify(wallet.address).lt(utils.bigNumberify(actionAddress))) {
                expected = concatenateSignatures([signature0, signature1]);
            } else {
                expected = concatenateSignatures([signature1, signature0]);
            }
            await expect(concatenatedSignatures).to.be.eq(expected);
        });
    });
});
