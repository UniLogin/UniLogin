import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CreatingIdView extends Component {
  render() {
    return (
      <div className="login-view">
        <div className="container">
          <h1 className="main-title">Creating ID...</h1>
          <div className="row align-items-center">
            <div className="row align-items-center">
              <div className="circle-loader" />
              <p className="login-view-text">
                {this.props.identityName} <br />
                <em>We are creating your new ID, please wait a minute...</em>
              </p>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreatingIdView.propTypes = {
  identityName: PropTypes.string
};

export default CreatingIdView;
