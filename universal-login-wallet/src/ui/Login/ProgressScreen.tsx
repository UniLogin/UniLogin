import React, {useState} from 'react';
import Spinner from './Spinner';


const Transferring = () => {
  const [complete] = useState(false);

  return (
    <div className="transferring">
      <div className="transferring-content">
        <div className="transferring-content-loader">
          <Spinner />
        </div>
        <h1 className="transferring-title">Transferring funds</h1>
        <div className="progress-bar">
          <div className={`progress-bar-line ${complete ? 'complete' : ''}`} />
        </div>
        <p className="transferring-text">2 ETH</p>
      </div>
    </div>
  );
};

export default Transferring;
