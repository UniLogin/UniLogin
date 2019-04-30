import React from 'react';
import WalletSelector from '../Login/WalletSelector';
import Modal from '../Modals/Modal';
import Sidebar from '../common/Sidebar';

const CompoundScreen = () => {
  return(
    <div className="dashboard">
    <Sidebar />
    <div className="dashboard-content dashboard-content-subscreen">
        <div className="login-compound">
          <p className="login-compound-subtitle">Compound Login.</p>
          <WalletSelector  onCreateClick={(name: string) => alert('not implemented')} onConnectionClick={() => alert('not implemented')}/>
          <Modal />
        </div>
    </div>
    </div>
  );
};

export default CompoundScreen;
