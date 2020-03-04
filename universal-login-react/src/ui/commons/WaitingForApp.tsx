import React from 'react';
import {WaitingFor, WaitingForProps} from './WaitingFor';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/waitingForTransaction.sass';
import '../styles/themes/Legacy/waitingForTransactionThemeLegacy.sass';
import '../styles/themes/Jarvis/waitingForTransactionThemeJarvis.sass';
import '../styles/themes/UniLogin/waitingForTransactionThemeUniLogin.sass';

export const WaitingForApp = ({description, className}: WaitingForProps) => (

  <div className={useClassFor('waitingfortransaction')}>
    <WaitingFor
      action="Loading..."
      className={className}
      description={description}
    />
    <div className={classForComponent('waitingfortransaction-modal-pending-section')}>
      <div className={classForComponent('waitingfortransaction-pending-img')}></div>
    </div>
  </div>
);
