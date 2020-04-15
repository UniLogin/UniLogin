import React, {useState} from 'react';
import {ConnectionFlow} from '@unilogin/react';
import {ConnectSelector} from './ConnectSelector';
import {useServices} from '../../hooks';
import {useHistory} from 'react-router';
import {Switch, Route} from 'react-router-dom';

export const ConnectAccount = () => {
  const {walletService} = useServices();
  const history = useHistory();
  const [name, setName] = useState<string | undefined>(undefined);
  return <div className="main-bg">
    <div className="box-wrapper">
      <div className="box"><Switch>
        <Route exact path="/connect/selector">
          <ConnectSelector setName={setName} />
        </Route>
        <Route path="/connect/">
          <ConnectionFlow
            basePath="/connect/"
            name={name!}
            walletService={walletService}
            onCancel={() => history.push('/connect/selector')}
            onSuccess={() => history.push('/connectionSuccess')}
          />
        </Route>
      </Switch>
      </div>
    </div>
  </div>;
};
