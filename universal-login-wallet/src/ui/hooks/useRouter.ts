import {useContext} from 'react';
import {RouterContext} from '../react/CustomBrowserRouter';

export function useRouter() {
  return useContext(RouterContext);
}
