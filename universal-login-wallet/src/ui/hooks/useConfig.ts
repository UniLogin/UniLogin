import {useServices} from './useServices';
import {useAsync} from './useAsync';

export const useConfig = () => {
  const {sdk} = useServices();
  const [config] = useAsync(async () => sdk.getRelayerConfig(), []);
  return config;
};
