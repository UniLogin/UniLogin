import React, {createContext, ReactNode, useState} from 'react';

type ContextProps = [string, (newTheme: string) => void];

export const ThemeContext = createContext<ContextProps>(['default', (newTheme: string) => {}]);

export type ThemeProps = {
  children: ReactNode;
  theme?: string;
};

export const ThemeProvider = ({children, theme}: ThemeProps) => {
  const themeHook = useState(theme || 'unilogin');

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
};
