import React, {Component} from 'react';
import logo from '../../assets/logo.svg';
import IdentitySelector from './IdentitySelector';
    <img src={logo} />
type LoginProps = {
  services: any;
};

type LoginState = {

};

class Login extends Component<LoginProps, LoginState> {
  async onItemClick(ensName: string) {
    await this.props.services.identityService.create(ensName);
    this.props.services.emitter.emit('setView', 'Wyre');
  }

  render() {
    return(
      <div className="container">
        <div className="login-view">
          <div className="container">
            <p className="login-view-text">
              <img src={logo} />
            </p>
            <h1 className="main-title">Universal Wallet</h1>
            <IdentitySelector
                onItemClick={this.onItemClick.bind(this)}
                services = {this.props.services}
              />
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
