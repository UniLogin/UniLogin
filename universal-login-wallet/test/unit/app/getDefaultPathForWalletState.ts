import {expect} from 'chai';
import {getDefaultPathForWalletState} from '../../../src/app/getDefaultPathForWalletState';
import {WalletState} from '@universal-login/sdk';

describe('UNIT: getDefaultPathForWalletState', () => {
  const itGetDefaultPathFor = (kind: string, path: string) =>
    it(`return proper path for ${kind}`, () => {
      expect(getDefaultPathForWalletState({kind} as WalletState)).to.be.eq(path);
    });

  itGetDefaultPathFor('Future', '/create');
  itGetDefaultPathFor('Deployed', '/wallet');
  itGetDefaultPathFor('Deploying', '/create');
  itGetDefaultPathFor('None', '/welcome');
});
