import chai, {expect} from 'chai';
import PendingExecution from '../../lib/utils/pendingExecution';
import {getWallets, solidity, deployContract, createMockProvider} from 'ethereum-waffle';
import {utils, Wallet, providers} from 'ethers';
import ERC1077 from 'universal-login-contracts/build/ERC1077.json';
import {ACTION_KEY} from 'universal-login-contracts';

chai.use(solidity);

describe('Relayer - WalletService', async () => {
  const provider = createMockProvider();
  const [wallet] = getWallets(provider);
  let pendingExecution: PendingExecution;
  let actionKey: string;

  beforeEach(async () => {
  	const walletContract = await deployContract(wallet, ERC1077, [wallet.address]);
  	const actionWallet = Wallet.createRandom();
  	actionKey = actionWallet.address;
  	pendingExecution = new PendingExecution(walletContract.address, wallet);
  	await walletContract.addKey(actionKey, ACTION_KEY);
  	await walletContract.setRequiredSignatures(2);
  });

  describe('should be correctly initizialized', async () => {
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
  });
});
