import React, {useState} from 'react';
import Accordion from '../Accordion';
import Printer from '../../assets/icons/printer.svg';
import EmptyBackupCodesView from './EmptyBackupCodesView';
import BackupCodesView from './BackupCodesView';
import BackupCodesLoader from './BackupCodesLoader';

const BackupCodes = () => {
  const [codes, setCodes] = useState<string[] | []>([]);
  const [loading, setLoading] = useState(false);
  const walletContract = 'liam.universal-id.eth';

  const generateBackupCodes = () => {
    const backupCodes = ['wokzai-tarwib-lezvie-lawgod', 'kenmil-syonuh-jujaro-zansar'];
    setLoading(true);

    setTimeout(() => {
      setCodes(backupCodes);
      setLoading(false);
    }, 2000);
  };

  const removeBackupCodes = () => {
    const message = 'You have NOT saved your backup keys! Proceeding will cancel and render these codes useless';
    if (confirm(message)) {
      setCodes([]);
    }
  };

  const renderContent = () => {
    if (loading && !codes.length) {
      return (
        <>
          <BackupCodesLoader title="Generating backup codes, please wait"/>
          <div className="backup-buttons-row">
            <button className="btn btn-secondary">Cancel backup code</button>
          </div>
        </>
      );
    } else if (codes.length) {
      return (
              <BackupCodesView
                codes={codes}
                printCodes={window.print}
                walletContract={walletContract}
                removeBackupCodes={removeBackupCodes}
                generateBackupCodes={generateBackupCodes}
                loading={loading}
              />
            );
    }
    return <EmptyBackupCodesView generateBackupCodes={generateBackupCodes}/>;
  };

  return (
    <Accordion
      title="Backup code"
      subtitle="Back up your account"
      icon={Printer}
    >
      {renderContent()}
    </Accordion>
  );
};

export default BackupCodes;
