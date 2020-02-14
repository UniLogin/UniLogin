import React, {useContext} from 'react';
import {useClassFor} from '../utils/classFor';
import {ThemedComponent} from '../commons/ThemedComponent';
import {ThemeContext} from '../themes/Theme';
import {styled} from '../styled';

const themes = ['default', 'jarvis', 'unilogin'];

export const ThemesPlayground = () => {
  const [theme, setTheme] = useContext(ThemeContext);

  return (
    <ThemedComponent name="selector">
      <select className="playground-theme-select" onChange={(event) => setTheme(event.target.value)}>
        {themes.map((themeName) => <option key={themeName} selected={theme === themeName}>{themeName}</option>)}
      </select>
      Element: {useClassFor('selector')}
      <Container>
        <Button>Default</Button>
        <Button small>Small</Button>
        <Button large>Large</Button>
      </Container>
    </ThemedComponent>
  );
};

const Container = styled.div('block');
const Button = styled.button('block__button', ['small', 'large']);
