import React, {useState} from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import {Wallet} from 'ethers';
import {NavigationColumn} from './ui/commons/NavigationColumn';
import {WalletSelector} from './ui/WalletSelector/WalletSelector';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {TEST_ACCOUNT_ADDRESS, generateCode, ApplicationWallet, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, CONNECTION_REAL_ADDRESS} from '@universal-login/commons';
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
import {EmojiKeyboardForm} from './ui/Notifications/EmojiKeyboardForm';

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



  const [applicationWallet, setApplicationWallet] = useState({name: '', contractAddress: '', privateKey: ''});

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
              path="/connecting"
              render={() => (
                <div>
                  <EmojiPanel code={generateCode(TEST_ACCOUNT_ADDRESS)} />
                  <EmojiForm
                    sdk={sdk}
                    publicKey={TEST_ACCOUNT_ADDRESS}
                    contractAddress={TEST_CONTRACT_ADDRESS}
                    privateKey={TEST_PRIVATE_KEY}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/keyboard"
              render={() => (
                <div>
                  <EmojiPanel code={generateCode(CONNECTION_REAL_ADDRESS)} />
                  <hr/>
                  <EmojiKeyboardForm
                    sdk={sdk}
                    contractAddress={TEST_CONTRACT_ADDRESS}
                    privateKey={TEST_PRIVATE_KEY}
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
                      <Modals />
                    </ReactModalContext.Provider>
                  </>
                  );
                }
              }
            />
            <Route exact path="/settings" render={() => <Settings />} />
            <Route exact path="/recover" render={() => (<div><p>Recover</p></div>)} />
            <Route component={() => (<p>not found</p>)} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
