import React, {ReactNode} from 'react';
import UniversalLoginSDK from '@universal-login/sdk';

export interface FeatureFlagProps {
  feature: string;
  children: ReactNode;
  sdk: UniversalLoginSDK;
}

export const FeatureFlag = ({sdk, feature, children}: FeatureFlagProps) => {
  if (sdk.featureFlagsService.isEnabled(feature)) {
    return <>{children}</>;
  }
  return null;
};
