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
    const {services} = this.props;
    this.historyService = services.historyService;
    this.ensNameService = services.ensNameService;
    this.clickService = services.clickService;
    this.tokenService = services.tokenService;
    this.identityService = services.identityService;
    this.state = {lastClick: '0', lastPresser: 'nobody', events: [], loaded: false, clickerClickEvent: false};
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

  async componentDidMount() {
    await this.updateClicksLeft();
    this.historyService.subscribe(this.onUpdate.bind(this));
    this.ensNameService.subscribe();
  }

  async updateClicksLeft() {
    const {address} = this.identityService.identity;
    const balance = await this.tokenService.getBalance(address);
    const clicksLeft = parseInt(balance, 10);
    this.setState({clicksLeft, clickerClickEvent: false});
    this.timeout = setTimeout(this.updateClicksLeft.bind(this), 2000);
  }

  componentWillUnmount() {
    this.ensNameService.unsubscribeAll();
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
