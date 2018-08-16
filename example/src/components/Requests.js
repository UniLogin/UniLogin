import React, { Component } from 'react';

class Request  extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      requests: 1
    };
  }

  render() {
    return (
      <button onClick={() => this.props.setView('PendingAuthorizations')} className="request-notification">{this.state.requests}</button>
    );
  }
}

export default Request;