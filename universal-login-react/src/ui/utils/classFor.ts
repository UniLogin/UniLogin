import {useContext} from 'react';
import {ThemeContext} from '../themes/Theme';

export function classForComponent(componentName: string) {
  return `unilogin-component-${componentName}`;
}

export function classFor(componentName: string) {
  return `${classForComponent(componentName)} ${themeClassFor()}`;
}

export const themeClassFor = () => {
  const theme = useContext(ThemeContext);
  console.log(`useContext: ${theme}`);
  return `unilogin-theme-${theme}`;
};
