import {useAsync} from '@universal-login/react';
import {useServices} from './useServices';

export const useRelayerConfig = () => {
  const {configService} = useServices();
  const [config] = useAsync(async () => configService.getRelayerConfig(), []);
  return config;
};
