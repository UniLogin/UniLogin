import React, {useState} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {Wallet} from 'ethers';
import {NavigationColumn} from './ui/commons/NavigationColumn';
import {WalletSelector} from './ui/WalletSelector/WalletSelector';
import {EmojiForm} from './ui/Notifications/EmojiForm';
import {ApplicationWallet, generateCode, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY} from '@universal-login/commons';
import {EmojiPanel} from './ui/WalletSelector/EmojiPanel';
import {Settings} from './ui/Settings/Settings';
import {Onboarding} from './ui/Onboarding/Onboarding';
import {useServices} from './core/services/useServices';
import {useModalService} from './core/services/useModalService';
import {ReactModalProps, ReactModalType, TopUpProps} from './core/models/ReactModalContext';
import {LogoButton} from './ui/UFlow/LogoButton';
import {CreateRandomInstance} from './ui/commons/CreateRandomInstance';
import './ui/styles/playground.css';
import {DeployedWallet} from '@universal-login/sdk';
import {Spinner} from './ui/commons/Spinner';
import {useAsync} from './ui/hooks/useAsync';
import {ModalsPlayground} from './ui/PlaygroundUtils/ModalsPlayground';
import {WalletService} from '@universal-login/sdk';
import {mockNotifications, CONNECTION_REAL_ADDRESS} from './ui/PlaygroundUtils/mockNotifications';

export const App = () => {
  const modalService = useModalService<ReactModalType, ReactModalProps>();
  const {sdk} = useServices();
  const [relayerConfig] = useAsync(async () => {
    await sdk.fetchRelayerConfig();
    return sdk.getRelayerConfig();
  }, []);

  const onCreate = (applicationWallet: ApplicationWallet) => {
    alert(`Wallet contract deployed at ${applicationWallet.contractAddress}`);
  };

  const onConnect = () => {
    console.log('connect clicked');
  };

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
            <Route
              exact
              path="/logobutton"
              render={() => {

                return (
                  <div>
                    <button onClick={() => mockNotifications(sdk)}>Create mock notifications</button>
                    <hr />
                    <CreateRandomInstance walletService={walletService} />
                    <hr />
                    <LogoButton walletService={walletService} />
                  </div>
                );
              }}
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
                  onCreateClick={() => {console.log('create');}}
                  onConnectClick={() => {console.log('connect');}}
                  sdk={sdk}
                  domains={['mylogin.eth', 'myapp.eth']}
                />
              )}
            />
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
                      onCancelClick={() => {}}
                      setPublicKey={() => {}}
                    />
                  </div>
                ) : <Spinner/>;
              }}
            />
            <Route
              exact
              path="/topup"
              render={() => {
                if (!relayerConfig) {
                  return <Spinner />;
                }
                const regularTopUpProps: TopUpProps = {
                  contractAddress: Wallet.createRandom().address,
                  sdk,
                  isDeployment: false,
                };
                const deploymentTopUpProps: TopUpProps = {
                  contractAddress: Wallet.createRandom().address,
                  sdk,
                  isDeployment: true,
                  onGasParametersChanged: console.log,
                };
                return <ModalsPlayground modalService={modalService} modalNames={['topUpAccount', 'topUpAccount']} modalProps={[regularTopUpProps, deploymentTopUpProps]} />;
              }
              }
            />
            <Route exact path="/settings" render={() => <Settings deployedWallet={new DeployedWallet(TEST_CONTRACT_ADDRESS, 'bob.mylogin.eth', TEST_PRIVATE_KEY, sdk)} />} />
            <Route exact path="/recover" render={() => (<div><p>Recover</p></div>)} />
            <Route exact path="/waiting" render={() => <ModalsPlayground modalService={modalService} modalNames={['waitingForOnRampProvider']} modalProps={[{onRampProviderName: 'ramp'}]}/>} />
            <Route component={() => (<p>not found</p>)} />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
