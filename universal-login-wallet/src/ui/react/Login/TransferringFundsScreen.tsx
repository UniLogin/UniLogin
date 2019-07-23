import React, {useState} from 'react';
import {ProgressBar, Spinner} from '@universal-login/react';

const TransferringFundScreen = () => {
  const [complete] = useState(false);

  return (
    <div className="transferring">
      <div className="transferring-content">
        <div className="transferring-content-loader">
          <Spinner />
        </div>
        <h1 className="transferring-title">Transferring funds</h1>
        <ProgressBar dual={!complete}/>
        <p className="transferring-text">2 ETH</p>
      </div>
    </div>
  );
};

export default TransferringFundScreen;
