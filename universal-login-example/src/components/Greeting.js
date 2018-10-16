import React, {Component} from 'react';
import GreetingView from '../views/GreetingView';
import PropTypes from 'prop-types';

class Greeting extends Component {
  constructor(props) {
    super(props);
    this.state = {status: {}};
  }

  showMainScreen() {
    this.props.identityService.emitter.emit('setView', 'MainScreen');
  }

  async componentDidMount() {
    const keyHolderAddress = this.props.identityService.identity.address;
    const {greetMode} = this.props.viewParameters;
    const status = await this.props.greetingService.getStatus(keyHolderAddress, greetMode);
    this.setState({status});
  }

  render() {
    const {identity} = this.props.identityService;
    return (
      <GreetingView
        identity={identity}
        onStartClick={this.showMainScreen.bind(this)}
        status={this.state.status}
      />
    );
  }
}

Greeting.propTypes = {
  identityService: PropTypes.object,
  greetingService: PropTypes.object,
  greetMode: PropTypes.number,
  viewParameters: PropTypes.object
};

export default Greeting;
