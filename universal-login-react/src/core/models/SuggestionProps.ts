export interface SuggestionProps {
  suggestion: string;
  selectedSuggestion: string;
  operationType: string;
  onClick(suggestion: string): Promise<void> | void;
}

export interface SingleSuggestionProps extends SuggestionProps {
  hint: string;
}
