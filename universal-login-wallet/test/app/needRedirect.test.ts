import {expect} from 'chai';
import {needRedirect} from '../../src/app/needRedirect';

describe('UNIT: needRedirect', () => {
  it('Default path for the state', () => {
    expect(needRedirect({kind: 'None'} as any, '/welcome')).to.be.false;
    expect(needRedirect({kind: 'Future'} as any, '/create/topUp')).to.be.false;
    expect(needRedirect({kind: 'Deploying'} as any, '/create/waiting')).to.be.false;
    expect(needRedirect({kind: 'Deployed'} as any, '/dashboard')).to.be.false;
    expect(needRedirect({kind: 'DeployedWithoutEmail'} as any, '/dashboard')).to.be.false;
  });

  it('Non-default path for the state', () => {
    expect(needRedirect({kind: 'None'} as any, '/welcome')).to.be.false;
    expect(needRedirect({kind: 'Deployed'} as any, '/dashboard/devices')).to.be.false;
    expect(needRedirect({kind: 'DeployedWithoutEmail'} as any, '/dashboard/devices')).to.be.false;
  });

  it('Path for different state', () => {
    expect(needRedirect({kind: 'None'} as any, '/dashboard')).to.be.true;
    expect(needRedirect({kind: 'None'} as any, '/create/topUp')).to.be.true;
    expect(needRedirect({kind: 'Deployed'} as any, '/terms')).to.be.true;
    expect(needRedirect({kind: 'Deployed'} as any, '/create/topUp')).to.be.true;
    expect(needRedirect({kind: 'DeployedWithoutEmail'} as any, '/create/topUp')).to.be.true;
  });
});
