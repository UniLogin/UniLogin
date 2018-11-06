import React from 'react';
import Collapsible from '../components/Collapsible';
import PropTypes from 'prop-types';

const Disconnect = (props) =>
  (<Collapsible
    title="Disconnect"
    subtitle="Disconnect this device form your wallet"
    icon="icon-disconnect"
  >
    <p className="advice-text">
    Danger! This operation will disconnect this device forever.
    You will not be able to perform any actions.
    </p>
    <button onClick={() => props.onDisconnectClick()} className="btn fullwidth">
      Disconnect
    </button>
  </Collapsible>
  );


Disconnect.propTypes = {
  onDisconnectClick: PropTypes.func
};

export default Disconnect;
