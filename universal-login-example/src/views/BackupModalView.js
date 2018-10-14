import React, {Component} from 'react';
import PropTypes from 'prop-types';

class BackupModalView extends Component {
  render() {
    return (
      <div className="modal-overlay">
        <div className="modal-body">
          <div className="modal-content">
            <p className="modal-text">
              Your backup codes have been set! Be sure to print out a copy of these codes.
            </p>
          </div>
          <div className="modal-footer">
            <button
              onClick={() => this.props.printScreen()}
              className="modal-btn"
            >
              Print Codes
            </button>
            <button
              onClick={() => this.props.showAccount()}
              className="modal-btn"
            >
              Return to Account
            </button>
          </div>
        </div>
      </div>
    );
  }
}

BackupModalView.propTypes = {
  showAccount: PropTypes.func,
  printScreen: PropTypes.func
};

export default BackupModalView;
