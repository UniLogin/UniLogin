import React from 'react';

export const OldVersion = ({newVersionLink} : {newVersionLink?: string}) =>
  <div className="old-version-box">
    <div className="old-version-text">
      <p className="old-version-text">
        You are using an old Jarvis Wallet version.
      </p>
    </div>
    <a href={newVersionLink} target='_blank' className="btn old-version-btn">
      Go to the new version
    </a>
  </div>;
