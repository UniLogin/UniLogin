import React from 'react';
import UniversalLoginSDK from '@universal-login/sdk';
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import {NavigationColumn} from './ui/commons/NavigationColumn';
import {WalletSelector} from '.';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {OnBoarding} from './OnBoarding';
import {TEST_ACCOUNT_ADDRESS, generateCode, generateCodeWithFakes} from '@universal-login/commons';
import {EmojiPanel} from './ui/WalletSelector/EmojiPanel';
import {TopUp} from './ui/TopUp/TopUp';
import {Settings} from './ui/Settings/Settings';
import {TestDiv} from './test';

export const App = () => {
  const sdk = new UniversalLoginSDK('http://localhost:3311', 'http://localhost:18545');
  const splitStyle = {
    height: '500px',
    padding: '20px'
  };

  const top = {
    left: '0',
    backgroundColor: '#e3d3c2',
    display: 'flex',
    paddingTop: '100px',
    justifyContent: 'center',
  };

  const bottom = {
    right: '0',
    backgroundColor: '#91a3f5'
  };

  return (
    <div style={{display: 'flex'}}>
      <BrowserRouter>
        <NavigationColumn/>
        <div style={{width: '80%'}}>
          <Switch>
            <Route exact path="/" render={() => (<p style={{width: '80%'}}>Home Screen</p>)}/>
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
            <Route exact path="/connecting" render={() => (<EmojiPanel code={generateCode(TEST_ACCOUNT_ADDRESS)}/>)}/>
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
            <Route exact path="/settings" render={() => (<div><p>Settings</p></div>)}/>
            <Route exact path="/recover" render={() => (<div><p>Recover</p></div>)}/>
            <Route component={() => (<p>not found</p>)}/>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
      // <div style={{...splitStyle, ...bottom}}>
      //   <p>Notifications</p>
      //   <EmojiForm
      //     sdk={sdk}
      //     publicKey={TEST_ACCOUNT_ADDRESS}
      //     securityCodeWithFakes={securityCodeWithFakes}
      //   />
      // </div>


  );
};

export default App;
