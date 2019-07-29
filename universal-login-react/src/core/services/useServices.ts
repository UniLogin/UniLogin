import {useContext} from 'react';
import {ServiceContext} from './createServices';

export const useServices = () => {
  return useContext(ServiceContext);
};
