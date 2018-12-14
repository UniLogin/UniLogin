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
    const {historyService} = this.props.services;
    this.historyService = historyService;
    const {clickService} = this.props.services;
    this.clickService = clickService;
    this.state = {lastClick: '0', lastPresser: 'nobody', events: [], loaded: false};
  }

  setView(view) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view);
  }

  async onClickerClick() {
    await this.clickService.click();
    this.setState({lastClick: '0'});
  }

  async componentDidMount() {
    await this.updateClicksLeft();
    this.historyService.subscribe(this.onUpdate.bind(this));
  }

  async updateClicksLeft() {
    const {tokenService} = await this.props.services;
    const {identityService} = this.props.services;
    const {address} = identityService.identity;
    const balance = await tokenService.getBalance(address);
    const clicksLeft = parseInt(balance, 10);
    this.setState({clicksLeft});
    this.timeout = setTimeout(this.updateClicksLeft.bind(this), 2000);
  }

  componentWillUnmount() {
    this.historyService.unsubscribeAll();
    clearTimeout(this.timeout);
  }

  onUpdate(pressers) {
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
