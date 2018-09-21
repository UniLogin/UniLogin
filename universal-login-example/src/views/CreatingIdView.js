import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CreatingIdView extends Component {
  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Creating ID...</h1>
          <p className="login-view-text">We are creating your new ID, please wait a minute.</p>
          <p className="user-id">{this.props.identityName}</p>
          <div className="circle-loader"></div>
        </div>
      </div>
    );
  }
}

CreatingIdView.propTypes = {
  identityName: PropTypes.string
};

export default CreatingIdView;
