import {expect} from 'chai';
import {isClassName} from '../../src/react/isClassName';

describe('UNIT: isClassName', () => {
  it('returns empty string', () => {
    expect(isClassName()).to.eq('');
  });

  it('returns className', () => {
    expect(isClassName('input-label')).to.eq('input-label');
  });
});
