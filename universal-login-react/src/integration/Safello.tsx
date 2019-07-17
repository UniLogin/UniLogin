
import React from 'react';

interface Safello {
  url: string;
}

export const Safello = (props: Safello) => {
  const {url} = props;
  return (
    <iframe
      src={url}
      width="500px"
      height="650px"
      sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"
      style={{ border: 'none', maxWidth: '100%' }}
    />
  );
};

export default Safello;
