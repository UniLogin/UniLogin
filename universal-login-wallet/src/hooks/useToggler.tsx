import { useState } from 'react';

const useToggler = () => {
  const [visible, setVisibility] = useState(false);
  const toggle = () => setVisibility(visible => !visible);

  return { visible, toggle };
};

export default useToggler;
