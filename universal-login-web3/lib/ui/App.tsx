import React from 'react';
import {Link, BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';
import {ExamplePlayground} from './react/ExamplePlayground';
import {Web3PickerPlayground} from './react/Web3PickerPlayground';

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <div>
          <Link to="/chooser">Chooser</Link>
          <br />
          <Link to="/example">Example</Link>
        </div>
        <Route exact path="/example" component={ExamplePlayground} />
        <Route exact path="/chooser" component={Web3PickerPlayground} />
      </BrowserRouter>
    </>
  );
};
