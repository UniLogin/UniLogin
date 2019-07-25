import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import {NavigationColumn} from './ui/commons/NavigationColumn';
import {WalletSelector} from '.';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {TEST_ACCOUNT_ADDRESS, generateCode, generateCodeWithFakes} from '@universal-login/commons';
import {EmojiPanel} from './ui/WalletSelector/EmojiPanel';
import {TopUp} from './ui/TopUp/TopUp';
import {Settings} from './ui/Settings/Settings';
import './ui/styles/playground.css';

export const App = () => {
  const sdk = new UniversalLoginSDK('http://localhost:3311', 'http://localhost:18545');

  return (
    <BrowserRouter>
      <div className="playground">
        <NavigationColumn/>
        <div className="playground-content">
          <Switch>
            <Route exact path="/" render={() => (<p style={{width: '80%'}}>Welcome to Universal Login</p>)}/>
            <Route exact path="/onboarding" render={() => (<p style={{width: '80%'}}>Onboarding</p>)}/>
            <Route
              exact
              path="/walletselector"
              render={() => (
                    <WalletSelector
                      onCreateClick={() => { console.log('create'); }}
                      onConnectionClick={() => { console.log('connect'); }}
                      sdk={sdk}
                      domains={['mylogin.eth']}
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
                <TopUp
                  contractAddress={TEST_ACCOUNT_ADDRESS}
                  onRampConfig={{safello: {
                    appId: '1234-5678',
                    baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
                    addressHelper: true
                  }}}
                />
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
