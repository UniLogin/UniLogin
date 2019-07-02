import {useContext} from 'react';
import {ServiceContext} from '../../services/Services';

export function useServices() {
  return useContext(ServiceContext);
}
