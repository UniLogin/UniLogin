import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import classIf from '../helpers/classIf';

class MainScreenView extends Component {
  renderEvent(event) {
    return (
      <p className="click-history-item" key={event.key}>
        <span className="date"> {event.pressTime} ago </span>
        <span className="bold user-inline">
          <Blockies seed={event.address.toLowerCase()} size={8} scale={4} />{' '}
          {event.name}
        </span>{' '}
        pressed at {event.score} seconds
      </p>
    );
  }

  renderEventList() {

    if (!this.props.loaded && this.props.events.length === 0) {
      return (<div className="loading"> Loading activity </div>);
    } else if (this.props.events.length === 0) {
      return <div> No events yet. Push the button! </div>;
    }
    return this.props.events.map(this.renderEvent.bind(this));
  }

  render() {
    return (
      <div
        className={classIf(
          this.props.lastClick === '0',
          'main-screen loadbar',
          'main-screen'
        )}
      >
        <div className="container text-center">
          <p>
            You have{' '}
            <span className="bold">
              {this.props.clicksLeft} <em>kliks</em>
            </span>{' '}
            left
          </p>
          <button
            className="btn main-screen-btn"
            onClick={this.props.onClickerClick}
            disabled={this.props.clickerClickEvent}
          >
            click here
          </button>

          <p className="click-cost">
            Costs 1 <em>klik</em>
          </p>
          <p className="last-click-text">
            Last time someone pressed this button was
            <span className="bold"> {this.props.lastClick}</span> ago
          </p>
          <hr className="separator" />
          <div className="click-history">{this.renderEventList()}</div>
        </div>
      </div>
    );
  }
}

MainScreenView.propTypes = {
  clicksLeft: PropTypes.number,
  lastClick: PropTypes.string,
  onClickerClick: PropTypes.func,
  clickerClickEvent: PropTypes.bool,
  loaded: PropTypes.bool,
  events: PropTypes.array
};

export default MainScreenView;
