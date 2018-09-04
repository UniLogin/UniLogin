import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MainScreenView extends Component {

  renderEvent(event) {
    return (
      <p className="click-history-item">{event.pressTime} ago <span className="bold">{event.address}</span> pressed at {event.score} seconds</p>
    );
  }
  render() {
    return (
      <div className="main-screen">
        <div className="container text-center">
          <p>You have <span className="bold">{this.props.clicksLeft} clicks</span> left</p>
          <button className="btn main-screen-btn" onClick={this.props.onClickerClick}>click here</button>
          <p className="click-cost">Costs 1 click</p>
          <div className="click-history">
            { this.props.events.map(this.renderEvent.bind(this)) }
          </div>
          <hr className="separator"/>
        </div>
      </div>
    );
  }
}

MainScreenView.propTypes = {
  clicksLeft: PropTypes.number,
  lastClick: PropTypes.number,
  onClickerClick: PropTypes.func,
  events: PropTypes.array,
};

export default MainScreenView;