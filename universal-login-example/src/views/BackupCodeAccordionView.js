import React from 'react';
import Collapsible from '../components/Collapsible';
import PropTypes from 'prop-types';

const BackupCodeAccordionView = (props) => (
  <Collapsible
    title="Backup code"
    subtitle="Back up your account"
    icon="icon-printer"
  >
    <p className="advice-text">
      If you lose all your devices you may not have other ways to recover your
      account. Generate a recovery code and keep it safe
    </p>
    <button onClick={() => props.setView('Backup')} className="btn fullwidth">
      Generate new codes
    </button>
  </Collapsible>
);

BackupCodeAccordionView.propTypes = {
  setView: PropTypes.func
};

export default BackupCodeAccordionView;
