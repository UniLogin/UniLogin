import React, {useState, useEffect} from 'react';
import {ensure, generateCode} from '@universal-login/commons';
import UniversalLoginSDK, {WalletService} from '@universal-login/sdk';
import {EmojiPanel} from '../WalletSelector/EmojiPanel';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import './../styles/emoji.sass';
import './../styles/emojiDefaults.sass';
import Spinner from '../commons/Spinner';

interface ConnectWithEmojiProps {
  name: string;
  sdk: UniversalLoginSDK;
  walletService: WalletService;
  onCancel: () => void;
  onConnect: () => void;
  className?: string;
}

export const ConnectWithEmoji = ({sdk, onCancel, walletService, className}: ConnectWithEmojiProps) => {
  const [securityCodes, setSecurityCodes] = useState<number[] | undefined>(undefined);

  useEffect(() => {
    if(walletService.state.kind === 'Connecting') {
      setSecurityCodes(generateCode(walletService.state.wallet.publicKey));
    };
  })

  const onCancelClick = async () => {
    const {contractAddress, privateKey} = walletService.getConnectingWallet();
    await cancelRequest(contractAddress, privateKey);
    await walletService.cancelWaitForConnection()
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
          <h1 className="connect-emoji-title">Connect to your account</h1>
          <div className="connect-emoji-content">
            <div className="connect-emoji-section">
              <p className="connect-emoji-text">Check the notification of another device controlling this account and type the emojis in this order.</p>
              {!securityCodes && <Spinner className="spinner-center" />}
              {securityCodes && <div className="universal-login-emojis">
                <EmojiPanel className="jarvis-styles" code={securityCodes} />
              </div>}
              <p className="connect-emoji-warning">Do not close this window, until the connection is completed.</p>
              <button onClick={onCancelClick} className="connect-emoji-btn">Cancel Request</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
