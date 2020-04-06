import React, {useState} from 'react';
import {ensure, generateCode} from '@unilogin/commons';
import {WalletService} from '@unilogin/sdk';
import {EmojiPanel} from '../WalletSelector/EmojiPanel';
import './../styles/emoji.sass';
import './../styles/emojiDefaults.sass';
import Spinner from '../commons/Spinner';
import {useAsyncEffect} from '../hooks/useAsyncEffect';
import {useThemeClassFor} from '../utils/classFor';
import '../styles/themes/UniLogin/connectWithEmojiThemeUniLogin.sass';

interface ConnectWithEmojiProps {
  walletService: WalletService;
  onCancel: () => void;
  onConnect: () => void;
  className?: string;
}

export const ConnectWithEmoji = ({onCancel, onConnect, walletService, className}: ConnectWithEmojiProps) => {
  const [securityCodes, setSecurityCodes] = useState<number[] | undefined>(undefined);
  useAsyncEffect(async () => {
    if (walletService.state.kind === 'Connecting') {
      setSecurityCodes(generateCode(walletService.state.wallet.publicKey));
      await walletService.waitForConnection();
      onConnect();
    };
  }, []);

  const onCancelClick = async () => {
    const connectingWallet = walletService.getConnectingWallet();
    try {
      await connectingWallet.cancelRequest();
    } catch (error) {
      ensure(error.response === 0, Error, 'Invalid cancel request');
    }
    await walletService.cancelWaitForConnection();
    onCancel();
  };

  return (
    <div className={`${useThemeClassFor()} universal-login-emojis`}>
      <div className="connect-emoji">
        <h1 className="connect-emoji-title">Connect to your account</h1>
        <div className="connect-emoji-content">
          <div className="connect-emoji-section">
            <p className="connect-emoji-text">Check the notification of another device controlling this account and type the emojis in this order.</p>
            {securityCodes
              ? <EmojiPanel code={securityCodes} />
              : <Spinner className="spinner-center" />}
            <p className="connect-emoji-warning">Do not close this window, until the connection is completed.</p>
            <button onClick={onCancelClick} className="connect-emoji-btn">Cancel Request</button>
          </div>
        </div>
      </div>
    </div>
  );
};
