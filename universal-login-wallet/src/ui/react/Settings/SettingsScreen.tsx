import React from 'react';
import {Header} from '../Home/Header';
import {Settings} from '@universal-login/react';

const SettingsScreen = () => (
  <div className="dashboard">
    <Header />
    <div className="dashboard-content dashboard-content-subscreen">
      <Settings />
    </div>
  </div>
);

export default SettingsScreen;
