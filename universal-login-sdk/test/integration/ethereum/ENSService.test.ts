import {expect} from 'chai';
import {utils} from 'ethers';
import {loadFixture, MockProvider} from 'ethereum-waffle';
import {basicENS} from '@unilogin/commons/testutils';
import {ENSService} from '../../../src/integration/ethereum/ENSService';
import {deployContract} from '@unilogin/commons';
import {gnosisSafe} from '@unilogin/contracts';

describe('INT: ENSService', () => {
  let ensAddress: string;
  let ensService: ENSService;
  let provider: MockProvider;
  let registrarAddress: string;
  let publicResolver: string;
  const label = 'justyna';
  const domain = 'mylogin.eth';
  const ensName = `${label}.${domain}`;

  before(async () => {
    ({ensAddress, provider, registrarAddress, publicResolver} = await loadFixture(basicENS));
    const [wallet] = provider.getWallets();
    const ensRegistrar = await deployContract(wallet, gnosisSafe.ENSRegistrar);
    ensService = new ENSService(provider, ensAddress, ensRegistrar.address);
  });

  it('should return null if domain doesn`t exist', async () => {
    expect(await ensService.argsFor('whatever.non-existing-id.eth')).to.be.null;
  });

  it('getDomainInfo should return proper registrar and resolver address', async () => {
    expect(await ensService.getDomainInfo(domain)).to.deep.eq({registrarAddress, resolverAddress: publicResolver});
  });

  it('argsFor should return proper arguments array', async () => {
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(ensName);
    const expectedArgs = [hashLabel, ensName, node, ensAddress, registrarAddress, publicResolver];
    expect(await ensService.argsFor(ensName)).to.deep.eq(expectedArgs);
  });

  it('encodes data for ENS Registrar', async () => {
    const args = await ensService.argsFor('justyna.mylogin.eth');
    const exepectedResult = new utils.Interface(gnosisSafe.ENSRegistrar.interface as any).functions.register.encode(args as string[]);
    expect(await ensService.getRegistrarData(ensName)).to.eq(exepectedResult);
  });
});
