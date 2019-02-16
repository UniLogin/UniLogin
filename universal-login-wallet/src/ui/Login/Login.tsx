import React, {Component} from 'react';
import IdentitySelector from './IdentitySelector';

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
            <h1 className="main-title">Universal Logins Clicker</h1>
            <p className="login-view-text">
            Clicker is an example application, that demonstrates Universal Logins, a design pattern for storing funds and connecting to Ethereum applications.
            </p>
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
