import React, { Component } from 'react';
import PropTypes from 'prop-types';

class DevicesModalView extends Component {
  render() {
    return (
      <div className="modal-overlay">
        <div className="modal-body">
          <div className="modal-content">
            <p className="modal-text">
              If you don
              {'\''}t have other working devices or recovery options, you will
              lose access to this account permanently. Costs 1 click
            </p>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => this.props.hideModal()}
              className="modal-btn"
            >
              Cancel
            </button>
            <button 
              onClick={() => this.props.removeDevice()}
              className="modal-btn"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }
}

DevicesModalView.propTypes = {
  removeDevice: PropTypes.func,
  hideModal: PropTypes.func
};

export default DevicesModalView;
