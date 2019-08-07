import React, {useState} from 'react';
import BackupCodesLoader from './BackupCodesLoader';
import BackupCodesView from './BackupCodesView';
import EmptyBackupCodesView from './EmptyBackupCodesView';
import Accordion from '../Accordion';

export const BackupCodes = () => {
  const [codes, setCodes] = useState<string[]>([]);
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
          <BackupCodesLoader title="Generating backup codes, please wait" />
          <button className="settings-btn">Cancel backup code</button>
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
    return <EmptyBackupCodesView generateBackupCodes={generateBackupCodes} />;
  };

  return (
    <Accordion
      title="Backup code"
      subtitle="Back up your account"
    >
      {renderContent()}
    </Accordion>
  );
};

export default BackupCodes;
