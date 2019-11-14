export type Suggestion = {
  kind: 'None';
} | {
  kind: 'KeepTyping';
} | {
  kind: 'Available';
  suggestions: SuggestionItem[];
} | SuggestionItem;

export type SuggestionItem = {
  kind: 'Creation';
  name: string;
} | {
  kind: 'Connection';
  name: string;
};
