export interface SuggestionProps {
  suggestion: string;
  operationType: string;
  onClick(suggestion: string): Promise<void> | void;
}

export interface SingleSuggestionProps extends SuggestionProps {
  hint: string;
}
