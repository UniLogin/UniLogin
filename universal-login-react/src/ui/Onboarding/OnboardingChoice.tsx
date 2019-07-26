import React from 'react';
import {OnboardingComponentType} from '../../core/models/OnboardingComponentType';
import Ether from './../assets/icons/ether.svg';
import {Button} from '../commons/Button';
import './../styles/topUpModalDefaults.css';

interface OnboardingChoiceProps {
  onChoice: (onboardingModalType: OnboardingComponentType) => void;
  className?: string;
}

export const OnboardingChoice = ({onChoice, className}: OnboardingChoiceProps) => {
  return(
    <div className={`topup ${className ? className : 'universal-login-topup'}`}>
      <h2 className="topup-title">Choose onboarding method</h2>
      <Button
        id={'create'}
        image={Ether}
        title="create"
        text="Create ne wallet"
        onClick={() => onChoice(OnboardingComponentType.create)}
      />
      <Button
        id={'connect'}
        image={Ether}
        title="connect"
        text="Connect to existing wallet"
        onClick={() => onChoice(OnboardingComponentType.connect)}
      />
      <Button
        id={'recover'}
        image={Ether}
        title="recover"
        text="Recover existing wallet"
        onClick={() => alert('recover not implemented')}
      />
    </div>
  );
};

export default OnboardingChoice;
