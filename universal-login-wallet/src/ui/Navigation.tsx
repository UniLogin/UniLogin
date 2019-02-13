import React from 'react';
import {NavLink} from 'react-router-dom';

const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink exact to="/" activeClassName="active">Home</NavLink></li>
      <li><NavLink exact to="/dogs" activeClassName="active">Dogs</NavLink></li>
    </ul>
  </nav>
);

export default Navigation;
