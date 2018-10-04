import PropTypes from 'prop-types';
import React, { Component } from 'react';

class RecoverAccountView extends Component {
  render() { 
    return ( 
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Account Recovery</h1>
          <p className="login-view-text">Enter a recovery code and click unlock.</p>
          <p className="user-id">{this.props.identity.name}</p>
          <input className="input login-view-input" type="text" onChange={e => this.props.onChange(e)} placeholder="Enter recovery code."/>
          <div><b>{this.props.isLoading ? 
            <p> Recovering Account... <div className="circle-loader" /> </p>
            : 
            <button className="btn fullwidth cancel-btn" onClick={this.props.onRecoverClick.bind(this)}>Recover Account</button>}
          </b></div>
          <button className="btn fullwidth cancel-btn" onClick={this.props.onCancelClick.bind(this)}>Cancel request</button>
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