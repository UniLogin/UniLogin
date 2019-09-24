import React from 'react';
import {Onboarding, OnboardingProps} from './Onboarding';

export function OnboardingModal(props: OnboardingProps) {
  return (
    <div className="onboarding-modal-container">
      <div className="onboarding-modal-content">
        <p style={{color: 'white', fontSize: 20, textAlign: 'center'}}>
          Create or connect account
        </p>
        <p style={{color: 'white', fontSize: 15}}>
          Type a nickname you want
        </p>
        <Onboarding {...props} />
      </div>
    </div>
  );
}
