const minLength = 10;
const minNumberOfCapitals = 1;
const minNumberOfSpecials = 1;
const minNumberOfDigits = 1;

export const validatePassword = (password: string) => {
  const regExp = new RegExp(
    `^(?=.*[A-Z]{${minNumberOfCapitals},})(?=.*[!@#$&*]{${minNumberOfSpecials},})(?=.*[0-9]{${minNumberOfDigits},}).{${minLength},}$`,
  );
  return !!password.match(regExp);
};
