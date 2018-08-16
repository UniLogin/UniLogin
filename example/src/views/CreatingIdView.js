import React, { Component } from 'react';

class CreatingIdView extends Component {
  render() { 
    return ( 
      <div className="login-view" onClick={() => this.props.setView('Greeting')}>
        <div className="container">
          <h1 className="main-title">Creating ID...</h1>
          <p className="login-view-text">We are creating your new ID, please wait a minute.</p>
          <p className="user-id">bobby.universal-id.eth</p>
          <div className="circle-loader"></div>
        </div>
      </div>
    );
  }
}
 
export default CreatingIdView;