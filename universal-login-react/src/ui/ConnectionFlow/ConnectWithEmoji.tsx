import React from 'react';
import {ensure} from '@universal-login/commons';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {useAsync} from '../hooks/useAsync';
import {EmojiPanel} from '../WalletSelector/EmojiPanel';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/emoji.sass'
import './../styles/emojiDefaults.sass'


interface ConnectWithEmojiProps {
  name: string;
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onCancel: () => void;
  onConnect: () => void;
  className?: string;
}

export const ConnectWithEmoji = ({name, sdk, onCancel, onConnect, walletService, className}: ConnectWithEmojiProps) => {
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
    <div className="universal-login-emojis">
      <div className={getStyleForTopLevelComponent(className)}>
        <div className="connect-emoji">
          <h1 className="connect-emoji-title">Confirmation</h1>
          <div className="connect-emoji-content">
            <div className="connect-emoji-section">
              <p className="connect-emoji-text">Check the notification of another device controlling this account and type the emojis in this order.</p>
              {!connectValues && !error && <p className="loading-text">Loading...</p>}
              {connectValues && <div className="universal-login-emojis">
                <EmojiPanel className="jarvis-styles" code={connectValues!.securityCode} />
              </div>}
              {error && `Error: ${error}`}
              <button onClick={onCancelClick} className="connect-emoji-btn">Cancel Request</button>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};
