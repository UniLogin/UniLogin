export const validateEmail = (email: string) => {
  return !!email.match(/^(?!(_|-|\.)).*^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};
