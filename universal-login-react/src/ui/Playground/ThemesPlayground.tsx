import React, {useContext} from 'react';
import {useClassFor} from '../utils/classFor';
import {ThemedComponent} from '../commons/ThemedComponent';
import {ThemeContext} from '../themes/Theme';

const themes = ['default', 'jarvis', 'unilogin'];

export const ThemesPlayground = () => {
  const [, setTheme] = useContext(ThemeContext);

  return (
    <ThemedComponent name="selector">
      <select className="playground-theme-select" onChange={(event) => setTheme(event.target.value)}>
        {themes.map((theme) => <option key={theme}>{theme}</option>)}
      </select>
      Element: {useClassFor('selector')}
    </ThemedComponent>
  );
};
