import React from 'react';
import logo from '../assets/logo.png'
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './Home';
import Dogs from './Dogs';
import Navigation from './Navigation';

const App = () => (
  <BrowserRouter>
    <div>
      <Navigation />
      <Route exact path="/" component={Home}/>
      <Route path="/dogs" component={Dogs}/>
      <img src={logo} />
    </div>
  </BrowserRouter>
);


export default App;
