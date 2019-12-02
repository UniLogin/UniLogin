import {expect} from 'chai';
import {needRedirect} from '../../../src/app/needRedirect';

describe('UNIT: needRedirect', () => {
  it('Default path for the state', () => {
    expect(needRedirect({kind: 'None'} as any, '/welcome')).to.be.false;
    expect(needRedirect({kind: 'Future'} as any, '/create')).to.be.false;
    expect(needRedirect({kind: 'Deploying'} as any, '/create')).to.be.false;
    expect(needRedirect({kind: 'Deployed'} as any, '/wallet')).to.be.false;
  });

  it('Non-default path for the state', () => {
    expect(needRedirect({kind: 'None'} as any, '/terms')).to.be.false;
    expect(needRedirect({kind: 'Deployed'} as any, '/wallet/devices')).to.be.false;
  });

  it('Path for different state', () => {
    expect(needRedirect({kind: 'None'} as any, '/wallet')).to.be.true;
    expect(needRedirect({kind: 'None'} as any, '/create')).to.be.true;
    expect(needRedirect({kind: 'Deployed'} as any, '/terms')).to.be.true;
    expect(needRedirect({kind: 'Deployed'} as any, '/create')).to.be.true;
  });
});
