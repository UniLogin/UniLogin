import React from 'react';
import {Link, BrowserRouter} from 'react-router-dom';
import {Route} from 'react-router';
import {Example} from './react/Example';
import {TestChooser} from './react/TestChooser';

export const App = () => {
  return (
    <>
    <BrowserRouter>
     <div>
       <Link to="/chooser">Chooser</Link>
       <br />
       <Link to="/example">Example</Link>
     </div>
        <Route exact path="/example" component={Example} />
        <Route exact path="/chooser" component={TestChooser} />
      </BrowserRouter>
    </>
  );
}