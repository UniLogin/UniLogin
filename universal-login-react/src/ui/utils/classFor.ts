import {useContext} from 'react';
import {ThemeContext} from '../themes/Theme';

export function classForComponent(componentName: string) {
  return `unilogin-component-${componentName}`;
}

export function useClassFor(componentName: string) {
  return `${classForComponent(componentName)} ${useThemeClassFor()}`;
}

export const useThemeClassFor = () => {
  const [theme] = useContext(ThemeContext);
  return `unilogin-theme-${theme}`;
};

export const useThemeName = () => {
  const [theme] = useContext(ThemeContext);
  return `${theme}`;
};
