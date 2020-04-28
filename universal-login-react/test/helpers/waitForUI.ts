import {ReactWrapper} from 'enzyme';
import {waitUntil, Predicate} from '@unilogin/commons';

export const waitForUI = async (wrapper: ReactWrapper, predicate: Predicate, timeout = 3000, tick = 100) => {
  await waitUntil(() => {
    wrapper.update();
    return predicate();
  }, tick, timeout);
};
