import React from 'react';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import {Wallet} from 'ethers';
import {NavigationColumn} from './ui/commons/NavigationColumn';
import {WalletSelector} from './ui/WalletSelector/WalletSelector';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {TEST_ACCOUNT_ADDRESS, generateCode, generateCodeWithFakes} from '@universal-login/commons';
import {EmojiPanel} from './ui/WalletSelector/EmojiPanel';
import {Settings} from './ui/Settings/Settings';
import {Onboarding} from './ui/Onboarding/Onboarding';
import {useServices} from './core/services/useServices';
import './ui/styles/playground.css';
import {useModal} from './core/services/useModal';
import Modal from './ui/Modals/Modal';

export const App = () => {

  const {sdk} = useServices();
  const modalService = useModal();

  const onCreate = () => {
    console.log('create clicked');
  };

  const onConnect = () => {
    console.log('connect clicked');
  };

  return (
    <BrowserRouter>
      <div className="playground">
        <NavigationColumn />
        <div className="playground-content">
          <Switch>
            <Route exact path="/" render={() => (<p>Welcome to Universal Login</p>)}/>
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
                  <EmojiPanel code={generateCode(TEST_ACCOUNT_ADDRESS)}/>
                  <EmojiForm
                    sdk={sdk}
                    publicKey={TEST_ACCOUNT_ADDRESS}
                    securityCodeWithFakes={generateCodeWithFakes(TEST_ACCOUNT_ADDRESS)}
                  />
                </div>
              )}
            />
            <Route
              exact
              path="/topup"
              render={() => (
                <>
                  <button onClick={() => modalService.showModal('topUpAccount')}>Show Topup</button>
                  <Modal modalService={modalService} contractAddress={Wallet.createRandom().address}/>
                </>
              )}
            />
            <Route exact path="/settings" render={() => <Settings/>}/>
            <Route exact path="/recover" render={() => (<div><p>Recover</p></div>)}/>
            <Route component={() => (<p>not found</p>)}/>
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
