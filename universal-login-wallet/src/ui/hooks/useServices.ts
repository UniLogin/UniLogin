import {useContext} from 'react';
import {ServiceContext} from '../Services';

export function useServices() {
  return useContext(ServiceContext);
}
