export type Suggestion = {
  kind: 'None';
} | {
  kind: 'KeepTyping';
} | {
  kind: 'TakenOrInvalid';
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
