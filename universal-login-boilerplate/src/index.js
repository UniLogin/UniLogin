import 'regenerator-runtime/runtime';
require('babel-core/register');
require('babel-polyfill');

/* eslint-disable import/first, no-undef, no-unused-vars */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(<App />, document.getElementById('app'));

/* eslint-enable import/first no-undef */
