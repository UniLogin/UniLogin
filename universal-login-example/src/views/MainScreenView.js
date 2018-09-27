import React, { Component } from "react";
import PropTypes from "prop-types";
import Blockies from "react-blockies";

class MainScreenView extends Component {
  renderEvent(event) {
    return (
      <p className="click-history-item" key={event.key}>
        <span className="date"> {event.pressTime} ago </span>
        <span className="bold user-inline">
          <Blockies seed={event.address} size={8} scale={4} /> {event.address}
        </span>{" "}
        pressed at {event.score} seconds
      </p>
    );
  }

  render() {
    return (
      <div className="main-screen">
        <div className="container text-center">
          <p>
            You have{" "}
            <span className="bold">{this.props.clicksLeft} clicks</span> left
          </p>
          <button
            className="btn main-screen-btn"
            onClick={this.props.onClickerClick}
          >
            click here
          </button>

          <p className="click-cost">Costs 1 click</p>
          <p className="last-click-text">
            Last time someone pressed this button was{" "}
            <span className="bold">{this.props.lastClick}</span> ago
          </p>
          <hr className="separator" />
          <div className="click-history">
            {this.props.events.map(this.renderEvent.bind(this))}
          </div>
          <hr className="separator" />
        </div>
      </div>
    );
  }
}

MainScreenView.propTypes = {
  clicksLeft: PropTypes.number,
  lastClick: PropTypes.number,
  onClickerClick: PropTypes.func,
  events: PropTypes.array
};

export default MainScreenView;
