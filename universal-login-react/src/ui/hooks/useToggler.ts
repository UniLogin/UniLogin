import {useState} from 'react';

export const useToggler = () => {
  const [visible, setVisibility] = useState(false);
  const toggle = () => setVisibility(visible => !visible);

  return {visible, toggle};
};

export const useTogglerWithSetter = () => {
  const [visible, setVisibility] = useState(false);
  const toggle = (value?: boolean) => {
    if (value !== undefined) {
      setVisibility(visible => value);
    } else {
      setVisibility(visible => !visible);
    }
  };

  return {visible, toggle};
};
