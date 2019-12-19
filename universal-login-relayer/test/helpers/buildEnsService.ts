
const ENSBuilder = require('ens-builder');
import {Wallet} from 'ethers';
import {withENS} from '@universal-login/commons';
import ENSService from '../../src/integration/ethereum/ensService';

const buildEnsService = async (wallet: Wallet, domain: string) => {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const ensAddress = await ensBuilder.bootstrapWith(label, tld);
  const provider = withENS(wallet.provider as any, ensAddress);
  const ensRegistrars = [domain];
  const ensService = new ENSService(ensBuilder.ens.address, ensRegistrars, provider);
  await ensService.start();
  return [ensService, provider, ensBuilder];
};

export default buildEnsService;
