import {expect} from 'chai';
import {createMockProvider} from 'ethereum-waffle';
import {getNetworkId} from '../../src/utils/getNetworkId';

describe('INT: getNetworkId', () => {
  it('return ganache network id', async () => {
    const provider = createMockProvider({network_id: 1234});
    const id = await getNetworkId(provider._web3Provider as any);
    expect(id).eq('1234');
  });
});
