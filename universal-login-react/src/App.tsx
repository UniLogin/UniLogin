import React, {useState} from 'react';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {Wallet} from 'ethers';
import {NavigationColumn} from './ui/commons/NavigationColumn';
import {WalletSelector} from './ui/WalletSelector/WalletSelector';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {generateCode, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {EmojiPanel} from './ui/WalletSelector/EmojiPanel';
import {Settings} from './ui/Settings/Settings';
import {Onboarding} from './ui/Onboarding/Onboarding';
import {useServices} from './core/services/useServices';
import {LogoButton} from './ui/UFlow/LogoButton';
import {CreateRandomInstance} from './ui/commons/CreateRandomInstance';
import './ui/styles/playground.css';
import {DeployedWallet} from '@universal-login/sdk';
import {Spinner} from './ui/commons/Spinner';
import {useAsync} from './ui/hooks/useAsync';
import {WalletService} from '@universal-login/sdk';
import {mockNotifications, CONNECTION_REAL_ADDRESS} from './ui/PlaygroundUtils/mockNotifications';
import {ModalWrapper} from './ui/Modals/ModalWrapper';
import {WaitingForOnRampProvider} from './ui/TopUp/Fiat/WaitingForOnRampProvider';
import {TopUp} from './ui/TopUp/TopUp';

export const App = () => {
  const {sdk} = useServices();
  const [relayerConfig] = useAsync(async () => {
    await sdk.fetchRelayerConfig();
    return sdk.getRelayerConfig();
  }, []);

  const [walletService] = useState(new WalletService(sdk));

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
            <Route exact path="/logoButton">
              <div>
                <button onClick={() => mockNotifications(sdk)}>Create mock notifications</button>
                <hr />
                <CreateRandomInstance walletService={walletService} />
                <hr />
                <LogoButton walletService={walletService} />
              </div>
            </Route>
            <Route exact path="/onboarding">
              <Onboarding
                sdk={sdk}
                walletService={walletService}
                domains={['mylogin.eth', 'universal-id.eth']}
                tryEnablingMetamask={tryEnablingMetamask}
              />
            </Route>
            <Route exact path="/walletSelector">
              <WalletSelector
                onCreateClick={() => {console.log('create');}}
                onConnectClick={() => {console.log('connect');}}
                sdk={sdk}
                domains={['mylogin.eth', 'myapp.eth']}
              />
            </Route>
            <Route
              exact
              path="/keyboard"
              render={() => {
                return relayerConfig ? (
                  <div>
                    <EmojiPanel code={generateCode(CONNECTION_REAL_ADDRESS)} />
                    <hr />
                    <EmojiForm
                      notifications={[]}
                      onDenyClick={() => {}}
                      setPublicKey={() => {}}
                    />
                  </div>
                ) : <Spinner />;
              }}
            />
            <Route
              exact
              path="/topUp"
              render={() =>
                <div>
                  <Link to="/topUpRegular">Regular</Link><br />
                  <Link to="/topUpDeployment">Deployment</Link>
                </div>}
            />
            <Route
              exact
              path="/topUpRegular"
              render={() => {
                if (!relayerConfig) {
                  return <Spinner />;
                }
                return <TopUp
                  hideModal={() => history.back()}
                  contractAddress={Wallet.createRandom().address}
                  sdk={sdk}
                  onGasParametersChanged={console.log}
                  isDeployment={false}
                  isModal
                />;
              }}
            />
            <Route
              exact
              path="/topUpDeployment"
              render={() => {
                if (!relayerConfig) {
                  return <Spinner />;
                }
                return <TopUp
                  hideModal={() => history.back()}
                  contractAddress={Wallet.createRandom().address}
                  sdk={sdk}
                  onGasParametersChanged={console.log}
                  isDeployment
                  isModal
                />;
              }}
            />
            <Route exact path="/settings" render={() => <Settings deployedWallet={new DeployedWallet(TEST_CONTRACT_ADDRESS, 'bob.mylogin.eth', TEST_PRIVATE_KEY, sdk)} />} />
            <Route exact path="/recover" render={() => (<div><p>Recover</p></div>)} />
            <Route exact path="/waiting">
              <ModalWrapper>
                <WaitingForOnRampProvider onRampProviderName={'ramp'} />
              </ModalWrapper>
            </Route>
            <Route component={() => (<p>not found</p>)} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
