import React, {Component} from 'react';
import ContentContainer from './ContentContainer';
import Services from '../services/Services';
import Modals from './Modals';

class App extends Component {
  constructor(props) {
    super(props);
    this.services = new Services();
  }

  componentDidMount() {
    this.services.start();
  }

  componentWillUnmount() {
    this.services.stop();
  }

  render() {
    return (
      <div>
        <ContentContainer services={this.services} />
        <Modals emitter={this.services.emitter} />
      </div>
    );
  }
}

export default App;
