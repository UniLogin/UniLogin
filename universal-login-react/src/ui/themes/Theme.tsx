import React, {ReactNode} from 'react';

export const ThemeContext = React.createContext<string>('default');

export type ThemeProps = {
  name: string;
  children: ReactNode;
};

export const Theme = ({name, children}: ThemeProps) => {
  return (
    <ThemeContext.Provider value={name}>
      {children}
    </ThemeContext.Provider>
  );
};
