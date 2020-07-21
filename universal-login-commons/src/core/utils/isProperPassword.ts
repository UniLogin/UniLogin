const minLength = 10;
const minNumberOfCapitals = 1;

export const isProperPassword = (password: string) => {
  const regExp = new RegExp(
    `^(?=.*[A-Z]{${minNumberOfCapitals},}).{${minLength},}$`,
  );
  return !!password.match(regExp);
};
