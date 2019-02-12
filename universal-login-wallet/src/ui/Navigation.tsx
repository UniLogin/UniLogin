import React from 'react';
import {NavLink} from 'react-router-dom';

const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink exact={true} to='/' activeClassName='active'>Home</NavLink></li>
      <li><NavLink exact={true} to='/dogs' activeClassName='active'>Dogs</NavLink></li>
    </ul>
  </nav>
);

export default Navigation;
