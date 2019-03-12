import React from 'react';

const Header = ({children} : {children: any}) => (
  <div className="header">
    <div className="header-dropdowns">
      {children}
    </div>
  </div>
);

export default Header;
