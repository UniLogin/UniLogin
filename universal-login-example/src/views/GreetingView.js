import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';

class GreetingView extends Component {
  render() {
    return (
      <div className="greeting-view">
        <div className="container">
          <div className="row">
            <Blockies
              seed={this.props.identity.address.toLowerCase()}
              size={8}
              scale={8}
            />
            <div>
              <p className="user-id">{this.props.identity.name}</p>
              <p className="wallet-address">{this.props.identity.address}</p>
            </div>
          </div>
          <hr className="separator" />
          <div className="row">
            <span className="checkmark-ico icon-check" />
            <div>
              <p>You created a new account</p>
              <p>
                Received 20 <em>kliks</em>
              </p>
            </div>
          </div>
          <hr className="separator" />
          <div className="row">
            <span className="bonus-ico icon-smartphone" />
            <div>
              <p>Add a second device to increase security</p>
              <p>
                You&#39;ll get 5 extra <em>kliks</em>
              </p>
            </div>
          </div>
          <hr className="separator" />
          <div className="row">
            <span className="icon-printer bonus-ico" />
            <div>
              <p>Save a backup code</p>
              <p>
                You&#39;ll get 10 extra <em>kliks</em>
              </p>
            </div>
          </div>
          <button
            className="btn fullwidth start-btn"
            onClick={this.props.onStartClick.bind(this)}
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }
}

GreetingView.propTypes = {
  identity: PropTypes.object,
  onStartClick: PropTypes.func
};

export default GreetingView;
