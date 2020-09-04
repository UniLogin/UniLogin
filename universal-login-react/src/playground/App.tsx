import React, {useState} from 'react';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {NavigationColumn} from '../ui/commons/NavigationColumn';
import {WalletSelector} from '../ui/WalletSelector/WalletSelector';
import {EmojiForm} from '../ui/Notifications/EmojiForm';
import {generateCode, TEST_CONTRACT_ADDRESS, TEST_PRIVATE_KEY, TEST_ACCOUNT_ADDRESS, TEST_MESSAGE_HASH, TEST_TRANSACTION_HASH} from '@unilogin/commons';
import {EmojiPanel} from '../ui/WalletSelector/EmojiPanel';
import {Onboarding} from '../ui/Onboarding/Onboarding';
import {CreateRandomInstance} from './CreateRandomInstance';
import UniLoginSdk, {DeployedWallet, DeployingWallet} from '@unilogin/sdk';
import {Spinner} from '../ui/commons/Spinner';
import {useAsync} from '../ui/hooks/useAsync';
import {WalletService} from '@unilogin/sdk';
import {mockNotifications, CONNECTION_REAL_ADDRESS} from '../ui/PlaygroundUtils/mockNotifications';
import {ModalWrapper} from '../ui/Modals/ModalWrapper';
import {WaitingForOnRampProvider} from '../ui/TopUp/Fiat/WaitingForOnRampProvider';
import {TopUp} from '../ui/TopUp/TopUp';
import {WaitingForTransaction} from '../ui/commons/WaitingForTransaction';
import {ThemesPlayground} from './ThemesPlayground';
import {ThemeProvider} from '../ui/themes/Theme';
import {ErrorMessage} from '../ui/commons/ErrorMessage';
import {AppPreloader} from '../ui/commons/AppPreloader';
import {TopUpProvider} from '../core/models/TopUpProvider';
import {ChooseTopUpToken} from '../ui/TopUp/ChooseTopUpToken';
import config from './config';
import {Dashboard} from '../ui/UFlow/Dashboard';
import '../ui/styles/playground.sass';
import {CreatePassword} from '../ui/Onboarding/CreatePassword';
import {EnterPassword} from '../ui/Onboarding/EnterPassword';
import {ConfirmCodeScreen} from '../ui/Onboarding/ConfirmCodeScreen';
import {CreateRandomInstanceEmail} from './CreateRandomInstanceEmail';
import {EnterEmail} from '../ui/Migrating/EnterEmail';

export const App = () => {
  const [sdk] = useState(() => {
    const sdk = new UniLoginSdk(config.relayerUrl, config.jsonRpcUrl, {
      applicationInfo: {type: 'laptop'},
      observedTokensAddresses: config.tokens,
      saiTokenAddress: config.saiTokenAddress,
      network: config.network,
    });
    sdk.featureFlagsService.enableAll(new URLSearchParams(window.location.search).getAll('feature'));
    sdk.start();
    return sdk;
  });
  const [relayerConfig] = useAsync(() => sdk.fetchRelayerConfig(), []);
  const [walletService] = useState(() => new WalletService(sdk));

  const name = 'test.mylogin.eth';

  const deployingWallet = new DeployingWallet({
    contractAddress: TEST_ACCOUNT_ADDRESS,
    name,
    privateKey: TEST_PRIVATE_KEY,
    deploymentHash: TEST_MESSAGE_HASH,
  }, sdk);

  const futureWallet = {
    contractAddress: TEST_ACCOUNT_ADDRESS,
    privateKey: TEST_PRIVATE_KEY,
    deploy: async () => deployingWallet,
    waitForBalance: (async () => {}) as any,
    getMinimalAmount: () => '1',
  } as any;

  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="playground">
          <NavigationColumn />
          <div className="playground-content">
            <Switch>
              <Route exact path="/" render={() => (<p>Welcome to Universal Login</p>)} />
              <Route exact path="/themes" render={() => <ThemesPlayground />} />
              <Route exact path="/logoButton">
                <div>
                  <button onClick={() => mockNotifications(sdk)}>Create mock notifications</button>
                  <hr />
                  <CreateRandomInstance walletService={walletService} />
                  <hr />
                  <Dashboard walletService={walletService} />
                </div>
              </Route>
              <Route
                exact
                path="/success"
                render={({history}) => <>
                  <div> Success!!! </div>
                  <br />
                  <button onClick={() => {
                    walletService.disconnect();
                    history.push('/onboarding');
                  }}>Disconnect</button>
                  <Dashboard walletService={walletService} />
                </>}
              />
              <Route
                exact
                path="/onboarding"
                render={({history}) =>
                  <Onboarding
                    walletService={walletService}
                    domains={config.domains}
                    onRestore={() => history.push('/success')}
                    onCreate={() => history.push('/success')}
                    hideModal={() => history.push('/')}
                    emailFlow={true}
                  />}
              />
              <Route
                exact
                path="/onboardingLegacy"
                render={({history}) =>
                  <Onboarding
                    walletService={walletService}
                    domains={config.domains}
                    onConnect={() => console.log('connected')}
                    onCreate={() => history.push('/success')}
                    hideModal={() => history.push('/')}
                  />}
              />
              <Route
                exact
                path="/chooseToken"
                render={({history}) =>
                  <ModalWrapper hideModal={() => history.push('/waitForTransaction')} message="This is a test environment running on Ropsten network">
                    <ChooseTopUpToken
                      supportedTokens={['ETH', 'DAI']}
                      onClick={() => {
                        console.log('Clicked');
                      }}
                      walletService={walletService}
                      hideModal={() => history.push('/')}
                    />
                  </ModalWrapper>}
              />
              <Route exact path="/walletSelector">
                <WalletSelector
                  onCreateClick={() => {console.log('create');}}
                  onConnectClick={() => {console.log('connect');}}
                  sdk={sdk}
                  domains={config.domains}
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
                  const topUpWalletService = new WalletService(sdk);
                  const topUpDeployedWallet = new DeployedWallet(TEST_CONTRACT_ADDRESS, 'bob.mylogin.eth', TEST_PRIVATE_KEY, sdk, 'bob@unilogin.test');
                  topUpWalletService.setWallet(topUpDeployedWallet.asSerializedDeployedWallet);
                  if (!relayerConfig) {
                    return <Spinner />;
                  }
                  return <TopUp
                    walletService={topUpWalletService}
                    hideModal={() => history.back()}
                    isModal
                  />;
                }}
              />
              <Route
                exact
                path="/topUpDeployment"
                render={() => {
                  const topUpWalletService = new WalletService(sdk);
                  topUpWalletService.setFutureWallet(futureWallet, name);
                  if (!relayerConfig) {
                    return <Spinner />;
                  }
                  return <TopUp
                    walletService={topUpWalletService}
                    hideModal={() => history.back()}
                    isModal
                  />;
                }}
              />
              <Route exact path="/recover" render={() => (<div><p>Recover</p></div>)} />
              <Route exact path="/waiting">
                <WaitingForOnRampProvider onRampProviderName={TopUpProvider.RAMP} />
              </Route>
              <Route exact path="/waitForTransaction">
                <div>
                  <ThemesPlayground />
                  <Link to="/waitForTransactionWithHash">With hash</Link><br />
                  <Link to="/waitForTransactionWithoutHash">Without hash</Link>
                </div>
              </Route>
              <Route
                path="/waitForTransactionWithHash"
                render={({history}) => {
                  if (!relayerConfig) {
                    return <Spinner />;
                  } else {
                    return (
                      <ModalWrapper hideModal={() => history.push('/waitForTransaction')} message="This is a test environment running on Ropsten network">
                        <WaitingForTransaction
                          action="Waiting for transfer"
                          relayerConfig={relayerConfig}
                          transactionHash={TEST_TRANSACTION_HASH}
                        />
                      </ModalWrapper>
                    );
                  }
                }}>
              </Route>
              <Route
                path="/waitForTransactionWithoutHash"
                render={({history}) => {
                  if (!relayerConfig) {
                    return <Spinner />;
                  } else {
                    return (
                      <ModalWrapper hideModal={() => history.push('/waitForTransaction')} message="This is a test environment running on Ropsten network">
                        <WaitingForTransaction
                          action="Waiting for transfer"
                          relayerConfig={relayerConfig}
                          transactionHash={undefined}
                        />
                      </ModalWrapper>
                    );
                  }
                }}>
              </Route>
              <Route
                path="/waitForApp"
                render={({history}) => (
                  <ModalWrapper hideModal={() => history.push('/')}>
                    <AppPreloader />
                  </ModalWrapper>
                )}>
              </Route>
              <Route
                exact path="/errorMessage"
                render={() => <ErrorMessage />}
              />
              <Route
                exact
                path="/createPassword"
                render={({history}) => <CreatePassword
                  hideModal={() => history.push('/')}
                  walletService={walletService}
                  onConfirm={(password) => console.log({password})} />}
              />
              <Route
                exact
                path="/enterPassword"
                render={({history}) => <EnterPassword
                  hideModal={() => history.push('/')}
                  walletService={walletService}
                  onConfirm={async (password) => console.log({password})}
                  onCancel={() => history.push('/')}
                />}
              />
              <Route
                exact
                path="/enterEmail"
                render={({history}) => <EnterEmail
                  hideModal={() => history.push('/')}
                  walletService={walletService}
                  onConfirm={async (email) => console.log({email})} />}
              />
              <Route
                exact
                path="/confirmCode"
                render={({history}) =>
                  <ConfirmCodeScreen
                    hideModal={() => history.push('/')}
                    walletService={walletService}
                    onConfirmCode={() => {}}
                    onCancel={() => console.log('onCancel')}
                  />}
              />
              <Route
                exact
                path="/createEmail"
                render={() =>
                  <div>
                    <CreateRandomInstanceEmail
                      walletService={walletService}
                    />
                    <Dashboard walletService={walletService} />
                  </div>
                }
              />
              <Route component={() => (<p>not found</p>)} />
            </Switch>
          </div>
        </div>
      </ThemeProvider>
    </BrowserRouter >
  );
};

export default App;
