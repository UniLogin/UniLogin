import React, { Component } from 'react';

class AppMainScreenView extends Component {
  render() {
    return (
      <div className="main-screen">
        <div className="container text-center">
          <p>You have <span className="bold">10 clicks</span> left</p>
          <button className="btn main-screen-btn">click here</button>
          <p className="click-cost">Costs 1 click</p>
          <p className="last-click-text">Last time someone pressed this button was <span className="bold">115 second ago</span></p>
          <hr className="separator"/>
          <div className="click-history">
            <p className="click-history-item">a few minutes ago <span className="bold">alice.universal.eth</span> pressed at 32 seconds</p>
            <p className="click-history-item">6 minutes ago <span className="bold">tom.universal.eth</span> pressed at 4 minutes</p>
            <p className="click-history-item">10 minutes ago <span className="bold">tom.universal.eth</span> pressed at 20 seconds</p>
          </div>
        </div>
      </div>
    );
  }
}

export default AppMainScreenView;