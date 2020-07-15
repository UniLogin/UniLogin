export const isProperEmail = (email: string) => {
  return !!email.match(/^(?!(_|-|\.)).*^[^\s@]+@[^\s@]+\.[^\s@]+$/);
};
