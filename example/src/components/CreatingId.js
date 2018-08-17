import React, { Component } from 'react';
import CreatingIdView from '../views/CreatingIdView';

class CreatingId extends Component {
  render() { 
    return (
      <CreatingIdView setView={this.props.setView}/>
    );
  }
}
 
export default CreatingId;