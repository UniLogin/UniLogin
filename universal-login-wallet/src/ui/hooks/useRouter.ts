import {useContext} from 'react';
import {RouterContext} from '../CustomBrowserRouter';

export function useRouter() {
  return useContext(RouterContext);
}
