export const getStyleClass = (className?: string) => {
  if (className === 'generic') {
    return '';
  }
  else if (!className || className === 'default') {
    return 'universal-login-default';
  }
  return className;
};
