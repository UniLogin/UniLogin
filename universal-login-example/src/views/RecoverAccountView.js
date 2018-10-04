import PropTypes from 'prop-types';
import React, { Component } from 'react';

class RecoverAccountView extends Component {
  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Account Recovery</h1>
          <p className="login-view-text">
            Enter a recovery code and click unlock.
          </p>
          <h2>{this.props.identity.name}</h2> <br />
          <input
            className="input login-view-input"
            type="text"
            onChange={e => this.props.onChange(e)}
            placeholder="Enter recovery code."
          />
          <div>
            <b>
              {this.props.isLoading ? (
                <p>
                  <br />
                  <div className="circle-loader" />{' '}
                  <strong>Recovering Account...</strong>
                </p>
              ) : (
                <button
                  className="btn fullwidth cancel-btn"
                  onClick={this.props.onRecoverClick.bind(this)}
                >
                  Recover Account
                </button>
              )}
            </b>
          </div>
          <button
            className="secondary-btn"
            onClick={this.props.onCancelClick.bind(this)}
          >
            Cancel request
          </button>
        </div>
      </div>
    );
  }
}

RecoverAccountView.propTypes = {
  isLoading: PropTypes.bool,
  onChange: PropTypes.func,
  identity: PropTypes.object,
  onCancelClick: PropTypes.func,
  onRecoverClick: PropTypes.func
};

export default RecoverAccountView;
