import {useState} from 'react';

export const useToggler = () => {
  const [visible, setVisibility] = useState(false);
  const toggle = (value?: boolean) => {
    if (value === undefined) {
      setVisibility(visible => !visible);
    } else {
      setVisibility(() => value);
    }
  };

  return {visible, toggle};
};
