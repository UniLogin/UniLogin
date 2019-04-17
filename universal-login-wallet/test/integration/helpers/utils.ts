import {ReactWrapper} from 'enzyme';
import {waitUntil, Predicate} from '@universal-login/commons';
import {AppPage} from '../pages/AppPage';
import {utils, providers} from 'ethers';
import {getWallets} from 'ethereum-waffle';

export const hasChangedOn = (wrapper: ReactWrapper, message: any) => {
  wrapper.update();
  return wrapper.text().includes(message);
};

export const waitForUI = async (wrapper : ReactWrapper, predicate: Predicate, timeout = 3000) => {
  await waitUntil(() => {
    wrapper.update();
    return predicate();
  }, 3, timeout);
};
