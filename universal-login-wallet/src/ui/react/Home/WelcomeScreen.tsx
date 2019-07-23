import React from 'react';
import { useRouter } from '../../hooks';

export const WelcomeScreen = () => {
  const {history} = useRouter();

  return (
    <div className="main-bg">
      <div className="welcome-box-wrapper">
        <div className="box welcome-box">
          <h1 className="welcome-box-title">Welcome in the<br/> <span>Jarvis Network</span></h1>
          <button onClick={() => history.push('/login')} className="welcome-box-connect">Connect to existing account</button>
          <div className="row justify-content-center align-items-center">
            <p className="welcome-box-text">No account yet?</p>
            <button onClick={() => history.push('/terms')} className="welcome-box-create">Create one</button>
          </div>
        </div>
      </div>
    </div>
  );
};
