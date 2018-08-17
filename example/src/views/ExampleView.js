import React, { Component } from 'react';

class ExampleView extends Component {
  render() {
    return (
      <div className="container">
        <h1 className="main-title">Example App</h1>
        <p className="example-text">You have <span className="bold">10.00</span> tokens</p>
        <textarea className="textarea example-textarea" placeholder="Type something you want to post forever on the blockchain"></textarea>
        <button className="btn fullwidth">POST</button>
        <hr className="separator"/>
        <div className="post">
          <p className="post-message">Hello world!</p>
          <p className="post-author">alice.universal-id.eth</p>
        </div>
        <div className="post">
          <p className="post-message">Hi everyone</p>
          <p className="post-author">bob.mylogin.eth</p>
        </div>
      </div>
    );
  }
}

export default ExampleView;