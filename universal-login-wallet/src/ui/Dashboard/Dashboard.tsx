import React, {Component} from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Notifications from './Notifications';
import UserSelect from './UserSelect';
import LatestTransfers from './LatestTransfersSection';
import ChartSection from './ChartSection';

type DashboardProps = {
  services: any;
};

type DashboardState = {
  balance: string;
};

class Dashboard extends Component<DashboardProps, DashboardState> {

  constructor(props : any) {
    super(props);
    this.state = {
      balance: '0'
    };
  }

  async componentDidMount() {
    this.interval = setInterval(() => this.updateBalance(), 1000);
  }

  async updateBalance() {
    const {address} = this.props.services.identityService.identity;
    const balance = await this.props.services.tokenService.getBalance(address);
    console.log(balance.toString())
    this.setState({balance: balance.toString()})
  }

  async sendTokens() {
    await this.props.services.identityService.sendTokens(document.getElementById('address').value, document.getElementById('amount').value * 10)
  }

  render() {
    return(
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-content">
          <Header>
            <Notifications />
            <UserSelect address={this.props.services.identityService.identity.address} name={this.props.services.identityService.identity.name}/>
          </Header>
          <input type="text" id="address" placeholder="address"/>
          <input type="text" id="amount" placeholder="amount"></input> 
          <button onClick={this.sendTokens.bind(this)}> Send </button>
          <ChartSection services={this.state.services} balance={this.state.balance} />
          <LatestTransfers balance={this.state.balance} />
        </div>
      </div>
    )
  }
}

export default Dashboard;
