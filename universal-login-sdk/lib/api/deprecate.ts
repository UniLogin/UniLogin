export function deprecateSDKMethod(subject: string) {
  console.warn(`sdk.${subject} is deprecated. Use DeployedWallet.${subject} method instead.`);
};
