import {expect} from 'chai';
import {classFor} from '../../src/ui/utils/classFor';

describe('UNIT: classFor', () => {
  it('Generates class for component', () => {
    expect(classFor('transfer-dialog')).to.eq('unilogin-component-transfer-dialog');
  });
});
