import React, {useContext} from 'react';
import {useClassFor} from '../utils/classFor';
import {ThemedComponent} from '../commons/ThemedComponent';
import {ThemeContext} from '../themes/Theme';

const themes = ['default', 'jarvis', 'unilogin'];

export const ThemesPlayground = () => {
  const [theme, setTheme] = useContext(ThemeContext);

  return (
    <ThemedComponent name="selector">
      <select className="playground-theme-select" onChange={(event) => setTheme(event.target.value)}>
        {themes.map((themeName) => <option key={themeName} selected={theme === themeName}>{themeName}</option>)}
      </select>
      Element: {useClassFor('selector')}
    </ThemedComponent>
  );
};
