import React, {createContext, ReactNode, useState} from 'react';

type ContextProps = [string, (newTheme: string) => void];

export const ThemeContext = createContext<ContextProps>(['default', (newTheme: string) => {}]);

export type ThemeProps = {
  children: ReactNode;
  initialTheme?: string;
};

export const ThemeProvider = ({children, initialTheme}: ThemeProps) => {
  const themeHook = useState(initialTheme || 'default');

  return (
    <ThemeContext.Provider value={themeHook}>
      {children}
    </ThemeContext.Provider>
  );
};
