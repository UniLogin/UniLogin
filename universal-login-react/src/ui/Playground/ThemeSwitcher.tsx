import React, {ReactNode, useState} from 'react';
import {Theme} from '../themes/Theme';

const themes = ['default', 'jarvis'];

export const ThemeSwitcher = (props: {children: ReactNode}) => {
  const [theme, setTheme] = useState<string>('default');

  return (
    <>
      <select className="playground-theme-select" onChange={(event) => setTheme(event.target.value)}>
        {themes.map((theme) => <option key={theme}>{theme}</option>)}
      </select>
      <Theme name={theme}>
        {props.children}
      </Theme>
    </>
  );
};
