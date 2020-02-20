const ENSBuilder = require('ens-builder');
import {withENS, parseDomain} from '@unilogin/commons';
import {Wallet, Contract, utils} from 'ethers';
import ENSService from '../../src/integration/ethereum/ensService';
import {ReverseRegistrarInterface, FIFSRegistrarInterface, PublicResolverInterface, ENSInterface} from '@unilogin/contracts';

export const buildEnsService = async (wallet: Wallet, domain: string) => {
  const ensBuilder = new ENSBuilder(wallet);
  const [label, tld] = domain.split('.');
  const ensAddress = await ensBuilder.bootstrapWith(label, tld);
  const provider = withENS(wallet.provider as any, ensAddress);
  const ensRegistrars = [domain];
  const ensService = new ENSService(ensBuilder.ens.address, ensRegistrars, provider);
  await ensService.start();
  return [ensService, provider, ensBuilder];
};

export const registerENSName = async (wallet: Wallet, ensAddress: string, ensName: string) => {
  const [label, domain] = parseDomain(ensName);
  const labelHash = utils.keccak256(utils.toUtf8Bytes(label));
  const node = utils.namehash(`${label}.${domain}`);

  const ens = new Contract(ensAddress, ENSInterface, wallet);
  const resolverAddress = await ens.resolver(utils.namehash(domain));
  const registrarAddress = await ens.owner(utils.namehash(domain));
  const reverseRegistrarAddress = await ens.owner(utils.namehash('addr.reverse'));

  const reverseRegistrar = new Contract(reverseRegistrarAddress, ReverseRegistrarInterface, wallet);
  const registrarContract = new Contract(registrarAddress, FIFSRegistrarInterface, wallet);
  const resolverContract = new Contract(resolverAddress, PublicResolverInterface, wallet);

  await registrarContract.register(labelHash, wallet.address, {gasLimit: 100000});
  await ens.setResolver(node, resolverAddress);
  await resolverContract.setAddr(node, wallet.address);
  await reverseRegistrar.setName(`${label}.${domain}`, {gasLimit: 500000});
};
