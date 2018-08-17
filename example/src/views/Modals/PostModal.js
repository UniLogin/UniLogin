import React, { Component } from 'react';

class PostModal extends Component {

  render() {
    return (
      <div className="modal-overlay">
        <div className="modal-body">
          <div className="modal-content">
          <p className="modal-text">Are you sure you want to send this? It will cost you 0.02 tokens</p>
          </div>
          <div className="modal-footer">
            <button onClick={() => this.props.hideModal()} className="modal-btn">Cancel</button>
            <button className="modal-btn">OK</button>
          </div>
        </div>
      </div>
    );
  }
}

export default PostModal;