export const classesForElement = (firstClass : string, secondClassPrefix : string) => (classSuffix? : string) =>
  classSuffix ? `${firstClass} ${secondClassPrefix}-${classSuffix}` : secondClassPrefix;

export const getSuggestionId = (operationType: string) =>
  operationType.replace(/ /g, '-');
