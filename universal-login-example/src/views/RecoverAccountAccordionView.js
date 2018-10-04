import React from 'react';
import Collapsible from '../components/Collapsible';
import PropTypes from 'prop-types';

const RecoverAccountAccordionView = props => (
  <div>
    <button
      onClick={() => props.setView('RecoverAccount')}
      className="secondary-btn"
    >
      Recover from backup
    </button>
  </div>
);

RecoverAccountAccordionView.propTypes = {
  setView: PropTypes.func
};

export default RecoverAccountAccordionView;
