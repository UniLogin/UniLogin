import React from 'react';

export const WelcomeScreen = () => (
  <div className="main-bg">
    <div className="container">
      <div className="box welcome-box">
        <h1 className="welcome-box-title">Welcome in the<br/> <span>Jarvis Network</span></h1>
        <button className="welcome-box-connect">Connect to existing account</button>
        <div className="row justify-content-center align-items-center">
          <p className="welcome-box-text">No account yet?</p>
          <button className="welcome-box-create">Create one</button>
        </div>
      </div>
    </div>
  </div>
);
