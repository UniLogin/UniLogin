export const validateEmail = (email: string) => {
  return !!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};
