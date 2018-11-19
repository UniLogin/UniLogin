import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Blockies from 'react-blockies';
import classnames from 'classnames';

class MainScreenView extends Component {
  constructor(props) {
    super(props);
    this.state = {page: 0};

    this.threeboxService = this.props.services.threeboxService;
  }

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

  async enableThreebox() {
    await this.threeboxService.enable();
    await this.threeboxService.open();
  }

  setPage(page) {
    this.setState({page});
  }

  render() {
    const button1 = classnames(
      'page-nav-button',
      {active: this.state.page === 0}
    );
    const container1 = classnames(
      'container',
      'text-center',
      'main-content',
      'clicker',
      {active: this.state.page === 0}
    );
    const button2 = classnames(
      'page-nav-button',
      {active: this.state.page === 1}
    );
    const container2 = classnames(
      'container',
      'text-center',
      'main-content',
      'threebox',
      {active: this.state.page === 1}
    );

    return (
      <div className="main-screen">
        <div className="page-nav">
          <a className={button1} onClick={this.setPage.bind(this, 0)}>
            Clicker
          </a>
          <a className={button2} onClick={this.setPage.bind(this, 1)}>
            3box.js
          </a>
        </div>

        <div className={container1}>
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
          <div className="click-history">
            {this.props.events.map(this.renderEvent.bind(this))}
          </div>
        </div>

        <div className={container2}>
          <p className="title">Set data with 3box</p>
          <div className="threebox-input">
            <p>Key</p>
            <input type="text"/>
          </div>
          <div className="threebox-input">
            <p>Value</p>
            <input type="text"/>
          </div>
          <div className="threebox-submit">
            <a onClick={this.enableThreebox.bind(this)}>Enable Metamask</a>
            <a>Add</a>
          </div>
          <div className="key-values">

          </div>
        </div>

      </div>
    );
  }
}

MainScreenView.propTypes = {
  clicksLeft: PropTypes.number,
  lastClick: PropTypes.string,
  onClickerClick: PropTypes.func,
  events: PropTypes.array,
  services: PropTypes.object
};

export default MainScreenView;
