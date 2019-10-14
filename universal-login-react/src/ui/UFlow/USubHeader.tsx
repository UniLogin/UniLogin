import React from 'react';

export interface USubHeaderProps {
  ensName: string;
  onBackButtonClick: () => void;
}

export const USubHeader = ({ensName, onBackButtonClick}: USubHeaderProps) => (
  <div className="udashboard-subheader">
    <button onClick={onBackButtonClick} className="udashboard-back-btn" />
    <p className="udashboard-ens">{ensName}</p>
  </div>
);
