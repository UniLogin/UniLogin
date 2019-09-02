import React from 'react';
import {EmojiPanel, useAsync} from '@universal-login/react';
import vault1x from './../../assets/illustrations/vault.png';
import vault2x from './../../assets/illustrations/vault@2x.png';
import {useServices, useRouter} from '../../hooks';
import {ConnectModal} from './ConnectAccount';

interface ConnectWithEmojiProps {
  name: string;
  setConnectModal: (modal: ConnectModal) => void;
}

export const ConnectWithEmoji = ({name, setConnectModal}: ConnectWithEmojiProps) => {
  const {connectToWallet} = useServices();
  const {history} = useRouter();
  const [connectValues, error] = useAsync(async () => connectToWallet(name, () => history.push('/')), []);

  const onDeny = () => {
    connectValues!.unsubscribe();
    setConnectModal('connectionMethod');
  };

  return (
    <div className="main-bg">
      <div className="box-wrapper">
        <div className="box">
          <div className="box-header">
            <h1 className="box-title">Confirmation</h1>
          </div>
          <div className="box-content connect-emoji-content">
            <div className="connect-emoji-section">
              <img src={vault1x} srcSet={vault2x} alt="avatar" className="connect-emoji-img" />
              <p className="box-text connect-emoji-text">Thanks, now check another device controling this account and enter the emojis in this order:</p>
              {!connectValues && !error && 'Loading...'}
              {connectValues && <div className="universal-login-emojis">
                <EmojiPanel className="jarvis-emojis" code={connectValues!.securityCode} />
              </div>}
              {error && `Error: ${error}`}
              <button onClick={onDeny} className="button-secondary connect-emoji-btn">Deny</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
