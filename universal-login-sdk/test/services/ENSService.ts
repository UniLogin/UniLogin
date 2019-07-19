import {expect} from 'chai';
import {providers, utils} from 'ethers';
import {loadFixture} from 'ethereum-waffle';
import {basicENS} from '@universal-login/commons/testutils';
import {ENSService} from '../../lib/services/ENSService';

describe('ENS Service', async () => {
  let ensAddress: string;
  let ensService: ENSService;
  let provider: providers.Provider;
  let registrarAddress: string;
  let domain: string;
  let ensRegistrars: string[];
  let publicResolver: string;

  before(async () => {
    ({ensAddress, provider, registrarAddress, ensRegistrars, publicResolver} = await loadFixture(basicENS));
    [domain] = ensRegistrars;
    ensService = new ENSService(provider, ensAddress);
  });

  it('should return null if domain doesn`t exist', async () => {
    expect(await ensService.argsFor('whatever.non-existing-id.eth')).to.be.null;
  });

  it('getDomainInfo should return proper registrar and resolver address', async () => {
    expect(await ensService.getDomainInfo(domain)).to.deep.eq({registrarAddress, resolverAddress: publicResolver});
  });

  it('argsFor should return proper arguments array', async () => {
    const label = 'justyna';
    const ensName = `${label}.${domain}`;
    const hashLabel = utils.keccak256(utils.toUtf8Bytes(label));
    const node = utils.namehash(ensName);
    const expectedArgs = [hashLabel, ensName, node, ensAddress, registrarAddress, publicResolver];
    expect(await ensService.argsFor(ensName)).to.deep.eq(expectedArgs);
  });
});
