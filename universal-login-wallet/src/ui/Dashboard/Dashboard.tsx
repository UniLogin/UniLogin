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

  async componentDidMount() {
    const {address} = this.props.services.identityService.identity;
    const balance = await this.props.services.tokenService.getBalance(address);
    this.setState({balance: balance.toString()})
  }

  render() {
    return(
      <div className="dashboard">
        <Sidebar />
        <div className="dashboard-content">
          <Header>
            <Notifications />
            <UserSelect name={this.props.services.identityService.identity.name}/>
          </Header>
          <ChartSection balance={this.state.balance} />
          <LatestTransfers balance={this.state.balance} />
        </div>
      </div>
    )
  }
}

export default Dashboard;
