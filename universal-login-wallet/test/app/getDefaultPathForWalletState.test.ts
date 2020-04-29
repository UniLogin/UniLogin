import {expect} from 'chai';
import {getDefaultPathForWalletState} from '../../src/app/getDefaultPathForWalletState';
import {WalletState} from '@unilogin/sdk';

describe('UNIT: getDefaultPathForWalletState', () => {
  const itGetDefaultPathFor = (kind: string, path: string) =>
    it(`return proper path for ${kind}`, () => {
      expect(getDefaultPathForWalletState({kind} as WalletState)).to.eq(path);
    });

  itGetDefaultPathFor('Future', '/create/topUp');
  itGetDefaultPathFor('Deployed', '/dashboard');
  itGetDefaultPathFor('Deploying', '/create/waiting');
  itGetDefaultPathFor('None', '/welcome');
  itGetDefaultPathFor('Connecting', '/connect/emoji');
});
