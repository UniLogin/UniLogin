import React from 'react';
import {useHistory} from 'react-router';

export interface SubDialogHeaderProps {
  ensName: string;
}

export const SubDialogHeader = ({ensName}: SubDialogHeaderProps) => {
  const history = useHistory();
  return (
    <div className="udashboard-subheader">
      <button onClick={() => history.goBack()} className="udashboard-back-btn"/>
      <p className="udashboard-ens">{ensName}</p>
    </div>
  );
};
