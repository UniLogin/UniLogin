import {useContext} from 'react';
import {RouterContext} from '../ui/CustomBrowserRouter';

export function useRouter() {
  return useContext(RouterContext);
}
