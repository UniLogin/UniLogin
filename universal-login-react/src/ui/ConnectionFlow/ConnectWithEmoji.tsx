import React from 'react';
import vault1x from './../assets/illustrations/vault.png';
import vault2x from './../assets/illustrations/vault@2x.png';
import {ensure} from '@universal-login/commons';
import UniversalLoginSDK from '@universal-login/sdk';
import {useAsync} from '../hooks/useAsync';
import {EmojiPanel} from '../WalletSelector/EmojiPanel';
import {OnboardingWalletService} from '../Onboarding/Onboarding';


interface ConnectWithEmojiProps {
  name: string;
  sdk: UniversalLoginSDK;
  walletService: OnboardingWalletService;
  onCancel: () => void;
  onConnect: () => void;
}

export const ConnectWithEmoji = ({name, sdk, onCancel, onConnect, walletService}: ConnectWithEmojiProps) => {
  const [connectValues, error] = useAsync(async () => walletService.connect(name, onConnect), []);

  const onCancelClick = async () => {
    const {contractAddress, privateKey} = walletService.getConnectingWallet();
    await cancelRequest(contractAddress, privateKey);
    walletService.disconnect();
    connectValues!.unsubscribe();
    onCancel();
  };

  const cancelRequest = async (contractAddress: string, privateKey: string) => {
    try {
      await sdk.cancelRequest(contractAddress, privateKey);
    } catch (error) {
      ensure(error.response === 0, Error, 'Invalid cancel request');
    }
  };

  return (
    <div>
      <div className="box-header">
        <h1 className="box-title">Confirmation</h1>
      </div>
      <div className="box-content connect-emoji-content">
        <div className="connect-emoji-section">
          <img src={vault1x} srcSet={vault2x} alt="avatar" className="connect-emoji-img" />
          <p className="box-text connect-emoji-text">Check the notification of another device controlling this account and type the emojis in this order.</p>
          {!connectValues && !error && 'Loading...'}
          {connectValues && <div className="universal-login-emojis">
            <EmojiPanel className="jarvis-styles" code={connectValues!.securityCode} />
          </div>}
          {error && `Error: ${error}`}
          <button onClick={onCancelClick} className="button-secondary connect-emoji-btn">Cancel Request</button>
        </div>
      </div>
    </div>
  );
};
