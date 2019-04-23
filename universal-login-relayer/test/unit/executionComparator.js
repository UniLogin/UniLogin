
import {expect} from 'chai';
import {executionComparator} from '../../lib/utils/utils';


describe('Execution Comparator', () => {
  it('should correctly compare two addresses', () => {
    const address1 = {key: '0x1'};
    const address2 = {key: '0x2'};
    expect(executionComparator(address1, address2)).to.eq(-1);
  });

  it('should correctly compare two addresses', () => {
    const address1 = {key: '0x2'};
    const address2 = {key: '0x1'};
    expect(executionComparator(address1, address2)).to.eq(1);
  });

  it('should correctly compare two addresses', () => {
    const address1 = {key: '0xA'};
    const address2 = {key: '0xB'};
    expect(executionComparator(address1, address2)).to.eq(-1);
  });

  it('should correctly compare two addresses', () => {
    const address1 = {key: '0x1A'};
    const address2 = {key: '0x2B'};
    expect(executionComparator(address1, address2)).to.eq(-1);
  });

  it('should correctly compare two addresses', () => {
    const address1 = {key: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'};
    const address2 = {key: '0xBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'};
    expect(executionComparator(address1, address2)).to.eq(-1);
  });

  it('should correctly compare two addresses', () => {
    const address1 = {key: '0x9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'};
    const address2 = {key: '0x8BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'};
    expect(executionComparator(address1, address2)).to.eq(1);
  });

  it('should correctly compare two addresses', () => {
    const address1 = {key: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'};
    const address2 = {key: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB'};
    expect(executionComparator(address1, address2)).to.eq(-1);
  });

  it('should correctly compare two equal addresses', () => {
    const address1 = {key: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'};
    const address2 = {key: '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'};
    expect(executionComparator(address1, address2)).to.eq(0);
  });

  it('should correctly compare two addresses', () => {
    const address1 = {key: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE'};
    const address2 = {key: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'};
    expect(executionComparator(address1, address2)).to.eq(-1);
  });
});
