import {useServices} from './useServices';

export const useWalletConfig = () => {
  const {config} = useServices();
  return config;
};
