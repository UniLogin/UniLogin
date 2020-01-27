import React, {createContext, ReactNode, useState} from 'react';

type ContextProps = [string, (newTheme: string) => void];

export const ThemeContext = createContext<ContextProps>(['default', (newTheme: string) => {}]);

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
