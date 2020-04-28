export const getSuggestionId = (operationType: 'create new' | 'connect') =>
  operationType.replace(/ /g, '-');
