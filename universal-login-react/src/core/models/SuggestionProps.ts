export interface SuggestionProps {
  suggestion: string;
  selectedSuggestion: string;
  operationType: SuggestionOperationType;
  onClick(suggestion: string): Promise<void> | void;
}

export interface SingleSuggestionProps extends SuggestionProps {
  hint: string;
}

export type SuggestionOperationType = 'create new' | 'connect';
