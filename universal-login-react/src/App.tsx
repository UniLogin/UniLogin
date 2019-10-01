import React, {useState} from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import {Wallet} from 'ethers';
import {NavigationColumn} from './ui/commons/NavigationColumn';
import {WalletSelector} from './ui/WalletSelector/WalletSelector';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {generateCode, ApplicationWallet, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {EmojiPanel} from './ui/WalletSelector/EmojiPanel';
import {Settings} from './ui/Settings/Settings';
import {Onboarding} from './ui/Onboarding/Onboarding';
import {useServices} from './core/services/useServices';
import Modals from './ui/Modals/Modals';
import {createModalService} from './core/services/createModalService';
import {ReactModalType, ReactModalContext, ReactModalProps} from './core/models/ReactModalContext';
import {useAsync} from './ui/hooks/useAsync';
import {LogoButton} from './ui/UFlow/LogoButton';
import {CreateRandomInstance} from './ui/commons/CreateRandomInstance';
import './ui/styles/playground.css';
import {asMock} from './core/utils/asMock';
import {DeployedWallet} from '@universal-login/sdk';

const CONNECTION_REAL_ADDRESS = '0xee2C70026a0E36ccC7B9446b57BA2bD98c28930b'; // [ 28, 133, 989, 653, 813, 746 ]

const ATTACKER_ADDRESS_1_COMMON_CODE = [ //   \/ common prefix
  '0x49c9A6784C061D298f9021a07eC218382feE20A9', // [ 28, 166, 290, 921, 215, 752 ]
  '0xf247e3c2f118763f79BE7C226D1c3dB988004704', // [ 28, 400, 410, 709, 633, 236 ]
];

const ATTACKER_ADDRESS_NO_COMMON_CODE = [
  '0x9a2c510AA7E56B83AFe6834f83C24512bafD7318', // [ 815, 929, 749, 6, 64, 323 ]
  '0xC633cE261FfE65950ef74DDF05b8A953fAFfc095', // [ 846, 391, 428, 775, 549, 877 ]
];

const mockedNotifications = asMock<Notification[]>([
  {key: CONNECTION_REAL_ADDRESS},
  ...ATTACKER_ADDRESS_1_COMMON_CODE.map(address => ({key: address})),
  ...ATTACKER_ADDRESS_NO_COMMON_CODE.map(address => ({key: address}))
]);

export const App = () => {
  const modalService = createModalService<ReactModalType, ReactModalProps>();
  const {sdk} = useServices();
  const [relayerConfig] = useAsync(() => sdk.getRelayerConfig(), []);

  const onCreate = (applicationWallet: ApplicationWallet) => {
    alert(`Wallet contract deployed at ${applicationWallet.contractAddress}`);
  };

  const onConnect = () => {
    console.log('connect clicked');
  };

  sdk.subscribeAuthorisations = (walletContractAddress: string, privateKey: string, callback: Function) => {
    callback(mockedNotifications);
    return () => {};
  };

  const [applicationWallet, setApplicationWallet] = useState({name: '', contractAddress: '', privateKey: ''});

  async function tryEnablingMetamask() {
    const ethereum = (window as any).ethereum;
    if (ethereum) {
      try {
        await ethereum.enable();

        return ethereum.selectedAddress;
      } catch (error) {
      }
    }
  }

  return (
    <BrowserRouter>
      <div className="playground">
        <NavigationColumn />
        <div className="playground-content">
          <Switch>
            <Route exact path="/" render={() => (<p>Welcome to Universal Login</p>)} />
            <Route
              exact
              path="/logobutton"
              render={() => (
                <div>
                  <CreateRandomInstance setApplicationWallet={setApplicationWallet}/>
                  <hr/>
                  <LogoButton
                    applicationWallet={applicationWallet}
                    sdk={sdk}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/onboarding"
              render={() => (
                <Onboarding
                  sdk={sdk}
                  onConnect={onConnect}
                  onCreate={onCreate}
                  domains={['mylogin.eth', 'universal-id.eth']}
                  tryEnablingMetamask={tryEnablingMetamask}
                />
              )}
            />
            <Route
              exact
              path="/walletselector"
              render={() => (
                <WalletSelector
                  onCreateClick={() => { console.log('create'); }}
                  onConnectClick={() => { console.log('connect'); }}
                  sdk={sdk}
                  domains={['mylogin.eth', 'myapp.eth']}
                />
              )}
            />
            <Route
              exact
              path="/keyboard"
              render={() => (
                <div>
                  <EmojiPanel code={generateCode(CONNECTION_REAL_ADDRESS)} />
                  <hr/>
                  <EmojiForm
                    deployedWallet={new DeployedWallet(TEST_CONTRACT_ADDRESS, 'bob.mylogin.eth', TEST_PRIVATE_KEY, sdk)}
                    onConnectionSuccess={() => { console.log('connect'); }}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/topup"
              render={() => {
                if (!relayerConfig) {
                  return <div>Loading...</div>;
                }
                const topUpProps = {
                  contractAddress: Wallet.createRandom().address,
                  onRampConfig: relayerConfig!.onRampProviders
                };
                return (
                  <>
                    <ReactModalContext.Provider value={modalService}>
                      <button onClick={() => modalService.showModal('topUpAccount', topUpProps)}>Show Topup</button>
                      <Modals sdk={sdk}/>
                    </ReactModalContext.Provider>
                  </>
                  );
                }
              }
            />
            <Route exact path="/settings" render={() => <Settings deployedWallet={new DeployedWallet(TEST_CONTRACT_ADDRESS, 'bob.mylogin.eth', TEST_PRIVATE_KEY, sdk)}/>} />
            <Route exact path="/recover" render={() => (<div><p>Recover</p></div>)} />
            <Route component={() => (<p>not found</p>)} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
