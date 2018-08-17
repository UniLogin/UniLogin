import React, { Component } from 'react';

class HeaderView extends Component {
  
  render() { 
    return ( 
      <header className="header">
        {this.props.children}
      </header>
    );
  }
}
 
export default HeaderView;