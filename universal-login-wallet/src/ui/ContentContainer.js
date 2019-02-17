import React, {Component} from 'react';
import Login from './Login/Login';
import Wyre from './Wyre';
import Dashboard from './Dashboard/Dashboard';
import PropTypes from 'prop-types';


class ContentContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Login',
      viewParameters: {}
    };
  }

  componentDidMount() {
    const {emitter} = this.props.services;
    this.subscription = emitter.addListener('setView', this.setView.bind(this));
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  setView(view, viewParameters = {}) {
    this.setState({view, viewParameters});
    scrollTo(0, 0);
  }

  render() {
    const {services} = this.props;
    if (this.state.view === 'Login') {
      return <Login services={services} />;
    } else if (this.state.view === 'Wyre') {
      return <Wyre
        identityService={services.identityService}
        // address = '0xB4DC65f8adE347d9D87D0d077F256aFC798c4dC6'
      />;
    } else if (this.state.view === 'Dashboard') {
      return <Dashboard services={services}/>;
    }
  }
}

ContentContainer.propTypes = {
  services: PropTypes.object
};

export default ContentContainer;
