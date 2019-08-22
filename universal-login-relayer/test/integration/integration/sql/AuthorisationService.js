import chai, {expect} from 'chai';
import AuthorisationStore from '../../../../lib/integration/sql/services/AuthorisationStore';
import {getWallets, createMockProvider, deployContract} from 'ethereum-waffle';
import WalletMaster from '@universal-login/contracts/build/WalletMaster.json';
import WalletService from '../../../../lib/integration/ethereum/WalletService';
import buildEnsService from '../../../helpers/buildEnsService';
import {createKeyPair, TEST_GAS_PRICE, calculateInitializeSignature, computeContractAddress} from '@universal-login/commons';
import {EventEmitter} from 'fbemitter';
import {getKnexConfig} from '../../../helpers/knex';
import deviceInfo from '../../../config/defaults';
import {deployFactory, encodeInitializeWithRefundData} from '@universal-login/contracts';
import {utils} from 'ethers';
import {WalletDeployer} from '../../../../lib/integration/ethereum/WalletDeployer';


chai.use(require('chai-string'));

describe('INT: Authorisation Service', async () => {
  let authorisationStore;
  let wallet;
  let provider;
  let contractAddress;
  let otherWallet;

  const {privateKey, publicKey} = createKeyPair();
  const ensName = 'justyna.mylogin.eth';

  const setupWalletService = async (wallet) => {
    const [ensService] = await buildEnsService(wallet, 'mylogin.eth');
    const walletMasterContract = await deployContract(wallet, WalletMaster);
    const factoryContract = await deployFactory(wallet, walletMasterContract.address);
    const walletDeployer = new WalletDeployer(factoryContract.address, wallet);
    const config = {walletMasterAddress: walletMasterContract.address, factoryAddress: factoryContract.address};
    const fakeBalanceChecker = {
      findTokenWithRequiredBalance: () => true
    };
    const walletContractService = new WalletService(wallet, config, ensService, new EventEmitter(), walletDeployer, fakeBalanceChecker);
    return {walletContractService, factoryContract, ensService};
  };

  const createFutureWallet = async (factoryContract, wallet, ensService) => {
    const futureContractAddress = computeContractAddress(factoryContract.address, publicKey, await factoryContract.initCode());
    await wallet.sendTransaction({to: futureContractAddress, value: utils.parseEther('1')});
    const args = await ensService.argsFor(ensName);
    const initData = encodeInitializeWithRefundData([publicKey, ...args, TEST_GAS_PRICE]);
    const signature = await calculateInitializeSignature(initData, privateKey);
    return {signature, futureContractAddress};
  };

  beforeEach(async () => {
    provider = createMockProvider();
    [wallet, otherWallet] = await getWallets(provider);
    authorisationStore = new AuthorisationStore(getKnexConfig());
    const {walletContractService, factoryContract, ensService} = await setupWalletService(wallet);
    const {futureContractAddress, signature} = await createFutureWallet(factoryContract, wallet, ensService);
    await walletContractService.deploy({publicKey, ensName, gasPrice: TEST_GAS_PRICE, signature});
    contractAddress = futureContractAddress;
  });

  it('Authorisation roundtrip', async () => {
    const request = {walletContractAddress: contractAddress, key: publicKey, deviceInfo};

    const [id] = await authorisationStore.addRequest(request);
    const authorisations = await authorisationStore.getPendingAuthorisations(contractAddress);
    expect(authorisations[authorisations.length - 1]).to.deep.eq({...request, id});

    await authorisationStore.removeRequest(otherWallet.address, publicKey);
    const authorisationsAfterDelete = await authorisationStore.getPendingAuthorisations(otherWallet.address);
    expect(authorisationsAfterDelete).to.deep.eq([]);
  });

  it('should return [] array when no pending authorisations', async () => {
    expect(await authorisationStore.getPendingAuthorisations(contractAddress)).to.deep.eq([]);
  });

  afterEach(async () => {
    await authorisationStore.database.delete().from('authorisations');
    await authorisationStore.database.destroy();
  });
});
