import {expect} from 'chai';
import {isValidRecipient} from '../../../lib/core/utils/isValidRecipient';

describe('isValidRecipient', () => {
  it('returns false if recipient undefined', () => {
    expect(isValidRecipient(undefined)).to.eq(false);
  });

  it('returns false if invalid address', () => {
    expect(isValidRecipient('0x123')).to.eq(false);
  });

  it('returns false if invalid ens name', () => {
    expect(isValidRecipient('test')).to.eq(false);
  });

  it('returns true if valid address', () => {
    expect(isValidRecipient('0x17ec8597ff92C3F44523bDc65BF0f1bE632917ff')).to.eq(true);
  });

  it('returns true if valid ens name', () => {
    expect(isValidRecipient('test.test.eth')).to.eq(true);
  });
});
