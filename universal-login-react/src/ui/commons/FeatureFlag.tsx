import React, {ReactNode} from 'react';
import UniLoginSdk from '@unilogin/sdk';

export interface FeatureFlagProps {
  feature: string;
  children: ReactNode;
  sdk: UniLoginSdk;
}

export const FeatureFlag = ({sdk, feature, children}: FeatureFlagProps) => {
  if (sdk.featureFlagsService.isEnabled(feature)) {
    return <>{children}</>;
  }
  return null;
};
