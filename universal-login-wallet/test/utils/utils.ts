import {ReactWrapper} from 'enzyme';
import {waitUntil, Predicate} from 'universal-login-commons';

export const hasChangedOn = (wrapper: ReactWrapper, message: any) => {
  wrapper.update();
  return wrapper.text().includes(message);
};

export const waitForUI = async (wrapper : ReactWrapper, predicate: Predicate) => {
  await waitUntil(() => {
    wrapper.update();
    return predicate();
  }, 3, 3000);
};
