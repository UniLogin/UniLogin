import chai, {expect} from 'chai';
import classnames from '../../src/helpers/classnames';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

describe('classnames', async () => {
  it('empty', async () => {
    expect(classnames({})).to.eq('');
  });

  it('one positive', async () => {
    expect(classnames({aa: true})).to.eq('aa');
  });

  it('one negative', async () => {
    expect(classnames({aa: false})).to.eq('');
  });

  it('multiple positive', async () => {
    expect(classnames({aa: 1, bb: true})).to.eq('aa bb');
  });

  it('multiple negative', async () => {
    expect(classnames({aa: false, bb: 0})).to.eq('');
  });

  it('multiple mixed', async () => {
    expect(classnames({aa: 1, bb: 1, cc: false, dd: 0, ef: true})).to.eq('aa bb ef');
  });
});
