export const getSuggestionId = (operationType: string) =>
  operationType.replace(/ /g, '-');
