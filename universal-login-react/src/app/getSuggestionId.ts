import {SuggestionOperationType} from '../core/models/SuggestionProps';

export const getSuggestionId = (operationType: SuggestionOperationType) =>
  operationType.replace(/ /g, '-');
