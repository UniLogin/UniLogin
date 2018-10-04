import React from 'react';
import Collapsible from '../components/Collapsible';
import PropTypes from 'prop-types';

const RecoverAccountAccordionView = props => (
  <Collapsible
    title="Recover Account"
    subtitle="Use a backup code to recover your account."
    icon="icon-printer"
  >
    <button onClick={() => props.setView('RecoverAccount')} className="btn fullwidth">
      Recover Account
    </button>
  </Collapsible>
);

RecoverAccountAccordionView.propTypes = {
  setView: PropTypes.func
};

export default RecoverAccountAccordionView;
