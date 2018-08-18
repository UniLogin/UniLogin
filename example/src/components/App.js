import React, {Component} from 'react';
import ContentContainer from './ContentContainer';
import {EventEmitter} from 'fbemitter';
import Backup from './Backup';
import Modals from './Modals';
import Account from './Account';

class App extends Component {
  constructor(props) {
    super(props);
    this.emitter = new EventEmitter();
  }

  render() { 
    return (
      <div>
        <ContentContainer emitter={this.emitter}/>
        <Modals emitter={this.emitter}/>
      </div>
    );
  }
}
 

export default App;
