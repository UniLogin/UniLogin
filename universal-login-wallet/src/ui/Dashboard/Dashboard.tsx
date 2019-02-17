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

};

class Dashboard extends Component<DashboardProps, DashboardState> {

  componentDidMount() {
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
          <ChartSection />
          <LatestTransfers />
        </div>
      </div>
    )
  }
}

export default Dashboard;
