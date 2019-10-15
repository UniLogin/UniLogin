import React from 'react';

export interface SubDialogHeaderProps {
  ensName: string;
  onBackButtonClick: () => void;
}

export const SubDialogHeader = ({ensName, onBackButtonClick}: SubDialogHeaderProps) => (
  <div className="udashboard-subheader">
    <button onClick={onBackButtonClick} className="udashboard-back-btn" />
    <p className="udashboard-ens">{ensName}</p>
  </div>
);
