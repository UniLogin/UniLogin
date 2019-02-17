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
  async onNextClick(identityName : any) {
  }

  async onChange(identity : any) {
  }

  async onAccountRecoveryClick(identity : any) {
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
                onNextClick={(identity : any) => this.onNextClick(identity)}
                onChange={this.onChange.bind(this)}
                onAccountRecoveryClick={this.onAccountRecoveryClick.bind(this)}
                services = {this.props.services}
                identitySelectionService={this.props.services.identitySelectionService}
              />
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
