import React, {Component} from 'react';
import MainScreenView from '../views/MainScreenView';
import HeaderView from '../views/HeaderView';
import RequestsBadge from './RequestsBadge';
import AccountLink from './AccountLink';
import ProfileIdentity from './ProfileIdentity';
import PropTypes from 'prop-types';

class MainScreen extends Component {
  constructor(props) {
    super(props);
    const {clickerService} = this.props.services;
    this.clickerService = clickerService;
    this.state = {
      lastClick: '0',
      lastPresser: 'nobody',
      events: [],
      loaded: false,
      clickerClickEvent: false
    };
  }

  setView(view) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view);
  }

  async onClickerClick() {
    // Users see changes to the state immediately, while the system waits to confirm them
    this.setState({lastClick: '0', clickerClickEvent: true});

    // Reset clicker event
    this.timeout = setTimeout(this.update.bind(this), 3000);

    await this.clickerService.click();
  }

  componentDidMount() {
    this.timeout = setTimeout(this.update.bind(this), 0);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  async update() {
    const {tokenService} = await this.props.services;
    const {identityService} = this.props.services;
    const {address} = identityService.identity;
    const balance = await tokenService.getBalance(address);
    const clicksLeft = parseInt(balance, 10);
    this.setState({clicksLeft, clickerClickEvent: false});
    const pressers = await this.clickerService.getPressEvents();
    if (pressers.length > 0) {
      this.setState({
        lastClick: pressers[0].pressTime,
        events: pressers,
        loaded: true
      });
    } else {
      this.setState({
        lastClick: '0',
        events: pressers,
        loaded: true
      });
    }
    setTimeout(this.update.bind(this), 1000);
  }

  render() {
    return (
      <div>
        <HeaderView>
          <ProfileIdentity
            type="identityHeader"
            identityService={this.props.services.identityService}
          />
          <RequestsBadge
            setView={this.setView.bind(this)}
            services={this.props.services}
          />
          <AccountLink setView={this.setView.bind(this)} />
        </HeaderView>
        <MainScreenView
          clicksLeft={this.state.clicksLeft}
          events={this.state.events}
          onClickerClick={this.onClickerClick.bind(this)}
          clickerClickEvent={this.state.clickerClickEvent}
          lastClick={this.state.lastClick}
        />
      </div>
    );
  }
}

MainScreen.propTypes = {
  services: PropTypes.object
};

export default MainScreen;
