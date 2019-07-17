
import React from 'react';
import {getSafelloUrl, UrlConfig} from './url';


export const Safello = (urlConfig: UrlConfig) => {
  return (
    <iframe
      src={`${getSafelloUrl(urlConfig)}`}
      width="500px"
      height="650px"
      sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts allow-popups"
      style={{ border: 'none', maxWidth: '100%' }}
    />
  );
};

export default Safello;
