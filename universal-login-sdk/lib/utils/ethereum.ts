export const codeEqual = (runtimeBytecode: string, liveBytecode: string) => {
  // TODO: verify if it is working
  const compareLength = runtimeBytecode.length - 68;
  return runtimeBytecode.slice(0, compareLength) === liveBytecode.slice(2, compareLength + 2);
};
