import React, {ReactNode, useState} from 'react';

export const ThemeContext = React.createContext<[string, (newTheme: string) => void]>(['default', (newTheme: string) => {}]);

export type ThemeProps = {
  children: ReactNode;
};

export const ThemeProvider = ({children}: ThemeProps) => {
  const themeHook = useState('default');

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
};
