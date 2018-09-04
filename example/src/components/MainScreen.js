import React, { Component } from 'react';
import MainScreenView from '../views/MainScreenView';
import HeaderView from '../views/HeaderView';
import Requests from './Requests';
import AccountLink from './AccountLink';
import ProfileIdentity from './ProfileIdentity';
import PropTypes from 'prop-types';

class MainScreen extends Component {

  constructor(props) {
    super(props);
    const {clickerService} = this.props.services;
    this.clickerService = clickerService;
    this.state = {lastClick: 20, lastPresser: 'nobody', events: []}; 
  }

  setView(view) {
    const {emitter} = this.props.services;
    emitter.emit('setView', view);
  }

  async onClickerClick() {
    await this.clickerService.click();
    this.setState({lastClick: 0});
  }

  componentDidMount() {
    setTimeout(this.update.bind(this), 0);
  }


  async update() {
    const pressers = await this.clickerService.getPressEvents();
    this.setState({
      lastClick: pressers[0].pressTime, 
      events: pressers});
    setTimeout(this.update.bind(this), 1000);
  }

  render() {
    return (
      <div>
        <HeaderView>
          <ProfileIdentity
            type="identityHeader"
            identityService={this.props.services.identityService}/>
          <Requests setView={this.setView.bind(this)} />
          <AccountLink setView={this.setView.bind(this)} />
        </HeaderView>
        <MainScreenView clicksLeft={7} events={this.state.events} onClickerClick={this.onClickerClick.bind(this)} lastClick={this.state.lastClick} />
      </div>
    );
  }
}

MainScreen.propTypes = {
  services: PropTypes.object
};

export default MainScreen;
