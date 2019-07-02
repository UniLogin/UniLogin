import {useContext} from 'react';
import {ServiceContext} from '../createServices';

export function useServices() {
  return useContext(ServiceContext);
}
