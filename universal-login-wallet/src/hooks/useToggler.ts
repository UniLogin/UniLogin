import {useState} from 'react';

export const useToggler = () => {
  const [visible, setVisibility] = useState(false);
  const toggle = () => setVisibility(visible => !visible);

  return {visible, toggle};
};
