import {expect} from 'chai';
import setupEnsArgsFor from '../../helpers/setupEnsArgsFor';
import {getWallets, createMockProvider} from 'ethereum-waffle';

describe('Relayer - argsFor', async () => {
  let wallet;
  let ensArgsFor;
  const domain = 'mylogin.eth';

  before(async () => {
    [wallet] = await getWallets(createMockProvider());
    [ensArgsFor] = await setupEnsArgsFor(wallet, domain);
  });

  it('throw error if domain', async () => {
    await expect(() => ensArgsFor('whatever.non-existing-id.eth')).to.throw(`ENS domain whatever.non-existing-id.eth does not exist or is not compatible with Universal Login`);
  });
});
