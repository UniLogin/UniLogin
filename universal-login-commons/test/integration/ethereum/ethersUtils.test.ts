import chai, {expect} from 'chai';
import chaiAsPromised from 'chai-as-promised';
import {utils} from 'ethers';
import IERC20 from 'openzeppelin-solidity/build/contracts/IERC20.json';
import {MockProvider} from 'ethereum-waffle';
import {TEST_PRIVATE_KEY} from '../../../src';
import {Filter, FilterByBlock} from '../../../src/integration/ethereum/ProviderService';
import {checkFilter} from '../../../src/integration/ethereum/ethersUtils';

chai.use(chaiAsPromised);

describe('UNIT: checkFilter', () => {
  const IErc20Interface = new utils.Interface(IERC20.abi);
  const address1 = '0xe22da380ee6B445bb8273C81944ADEB6E8450422';
  const address2 = '0x1c4a937d171752e1313D70fb16Ae2ea02f86303e';

  describe('Filter', () => {
    const createFilter = (filterOverrides?: Partial<Filter>) => ({
      address: [address1, address2],
      fromBlock: 4,
      toBlock: 'latest',
      topics: [IErc20Interface.events['Transfer'].topic],
      ...filterOverrides,
    });

    it('list of addresses', () => {
      expect(checkFilter(createFilter())).deep.eq(createFilter({fromBlock: '0x4'}));
    });

    it('single address', () => {
      const filter = createFilter({address: address1});
      const expectedFilter = createFilter({address: address1, fromBlock: '0x4'});

      expect(checkFilter(filter)).deep.eq(expectedFilter);
    });

    it('fails with original version', async () => {
      const provider = new MockProvider();
      await expect(provider.getLogs(createFilter() as any)).rejectedWith('invalid address - 0xe22da380ee6B445bb8273C81944ADEB6E8450422,0x1c4a937d171752e1313D70fb16Ae2ea02f86303e');
    });
  });

  describe('FilterByBlock', () => {
    const createFilterByBlock = (filterOverrides?: Partial<FilterByBlock>): FilterByBlock => ({
      address: [address1, address2],
      topics: [IErc20Interface.events['Transfer'].topic],
      blockHash: TEST_PRIVATE_KEY,
      ...filterOverrides,
    });

    it('list of addresses', () => {
      const filter = createFilterByBlock();
      expect(checkFilter(filter)).deep.eq(filter);
    });

    it('single address', () => {
      const filter = createFilterByBlock({address: address1});
      expect(checkFilter(filter)).deep.eq(filter);
    });
  });
});
