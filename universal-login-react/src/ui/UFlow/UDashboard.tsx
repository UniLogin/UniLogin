import React, {useState} from 'react';
import {ModalWrapper} from '../Modals/ModalWrapper';
import {UHeader} from './UHeader';
import {Funds} from './Funds';
import {USettings} from './USettings';
import {ApplicationWallet} from '@universal-login/commons';
import {useAsync} from '../hooks/useAsync';
import UniversalLoginSDK from '@universal-login/sdk';
import logoIcon from '../assets/icons/U.svg';
import {dashboardContentType} from '../../core/models/ReactUModalContext';
import './../styles/udashboard.css';
import {TopUp} from '../TopUp/TopUp';
import {ApproveDevice} from './ApproveDevice';

export interface UDashboardProps {
  applicationWallet: ApplicationWallet;
  sdk: UniversalLoginSDK;
}

export const UDashboard = ({applicationWallet, sdk}: UDashboardProps) => {
  const [dashboardContent, setDashboardContent] = useState<dashboardContentType>('none');
  const [dashboardVisibility, setDashboardVisibility] = useState(false);
  const [relayerConfig] = useAsync(() => sdk.getRelayerConfig(), []);

  const onUButtonClick = () => {
    setDashboardVisibility(true);
    setDashboardContent('funds');
  };

  const renderDashboardContent = () => {
    switch (dashboardContent) {
      case 'funds':
        return (
          <Funds
            ensName={applicationWallet.name}
            sdk={sdk}
            onTopUpClick={() => setDashboardContent('topup')}
            onSendClick={() => setDashboardContent('transfer')}
          />
        );
      case 'approveDevice':
        return (
          <ApproveDevice
            contractAddress={applicationWallet.contractAddress}
            privateKey={applicationWallet.privateKey}
            sdk={sdk}
          />
        );
      case 'settings':
        return <USettings />;
      case 'topup':
        return (
          <TopUp
            hideModal={() => setDashboardVisibility(false)}
            contractAddress={applicationWallet.contractAddress}
            onRampConfig={relayerConfig!.onRampProviders}
          />
        );
      default:
        return null;
    }
  };


  return (
    <>
      <button onClick={() => onUButtonClick()}>
        <img src={logoIcon} alt="U"/>
      </button>
      {dashboardVisibility &&
        <ModalWrapper
          hideModal={() => setDashboardVisibility(false)}
          modalClassName="udashboard-modal"
        >
          <UHeader activeTab={dashboardContent} setActiveTab={setDashboardContent} />
          <div className="udashboard-content">
            {renderDashboardContent()}
          </div>
        </ModalWrapper>
      }
    </>
  );
};
