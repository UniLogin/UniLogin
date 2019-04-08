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

export const createAndSendInitial = async (appWrapper : ReactWrapper, provider: providers.Web3Provider) => {
  const appPage = new AppPage(appWrapper);
  await appPage.login().pickUsername('super-name', 'create new', 'Transfer one of following');
  const address = appPage.login().getAddress();
  const [wallet] = await getWallets(provider);
  await wallet.sendTransaction({to: address, value: utils.parseEther('2.0')});
  await appPage.login().waitForHomeView('2.0');
  return appPage;
};
