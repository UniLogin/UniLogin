import {useAsync} from '@universal-login/react';
import {useServices} from './useServices';

export const useRelayerConfig = () => {
  const {sdk} = useServices();
  const [config] = useAsync(async () => sdk.getRelayerConfig(), []);
  return config;
};
