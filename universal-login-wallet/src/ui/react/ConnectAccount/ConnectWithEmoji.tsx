import React, {useEffect} from 'react';
import {EmojiPanel} from '@universal-login/react';
import vault1x from './../../assets/illustrations/vault.png';
import vault2x from './../../assets/illustrations/vault@2x.png';
import {useServices, useRouter, useAsync} from '../../hooks';

interface ConnectWithEmojiProps {
  name: string;
}

export const ConnectWithEmoji = ({name}: ConnectWithEmojiProps) => {
  const {connectToWallet} = useServices();
  const {history} = useRouter();
  const [connectValues, error] = useAsync(async () => connectToWallet(name, () => history.push('/')), []);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  const onDeny = () => {
    connectValues!.unsubscribe();
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
              {!connectValues && !error && 'Loading'}
              {connectValues && <EmojiPanel code={connectValues!.securityCode} />}
              {error && 'Error!'}
              <button onClick={onDeny} className="button-secondary connect-emoji-btn">Deny</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
