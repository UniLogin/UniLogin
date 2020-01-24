import {expect} from 'chai';
import {classForComponent} from '../../src/ui/utils/classFor';

describe('UNIT: classFor', () => {
  it('classForComponent', () => {
    expect(classForComponent('transfer-dialog')).to.eq('unilogin-component-transfer-dialog');
  });
});
