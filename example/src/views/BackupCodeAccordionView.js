import React from 'react';
import Collapsible from '../components/Collapsible';
import BackupIco from '../img/printer.svg';

const BackupCodeAccordionView = (props) => (
  <Collapsible
    title="Backup code"
    subtitle="You have saved this"
    icon={BackupIco}
  >
    <p className="advice-text">
      If you lose all your devices you may not have other ways to recover
      your account. Generate a recovery code and keep it safe
    </p>
    <button onClick={() => props.setView('Backup')} className="btn fullwidth">Generate new code</button>
  </Collapsible>
);

export default BackupCodeAccordionView;