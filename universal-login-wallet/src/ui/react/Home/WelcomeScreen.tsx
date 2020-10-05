import React from 'react';
import {useHistory} from 'react-router';
import {Notice} from '@unilogin/react';
import {useServices} from '../../hooks';

export const WelcomeScreen = () => {
  const history = useHistory();
  const {sdk} = useServices();
  const notice = sdk.getNotice();

  return (
    <div className="main-bg">
      <div className="welcome-box-wrapper">
        <div className="box welcome-box">
          <Notice message={notice} />
          <div className="welcome-box-content">
            <h1 className="welcome-box-title">Welcome in the<br/> <span>Jarvis Network</span></h1>
            <button onClick={() => history.push('/connect/selector')} className="welcome-box-connect">
              Connect to existing account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
