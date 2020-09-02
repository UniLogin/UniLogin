import {isValidEnsName} from '@unilogin/commons';
import UniLoginSdk from '@unilogin/sdk';

export const isEnsNameTaken = (sdk: UniLoginSdk) => async (name: string) => {
  return sdk.resolveName(name);
};

export const ensNameValidators = (sdk: UniLoginSdk) => [
  {
    validate: isValidEnsName,
    errorMessage: 'Ens name is not valid',
  }, {
    errorMessage: 'Ens name already taken',
    validate: async (name: string) => !(await isEnsNameTaken(sdk)(name)),
  },
];
