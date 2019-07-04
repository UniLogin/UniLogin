import {debounce} from '../utils/debounce';
import {WalletSelectionService} from './WalletSelectionService';

export interface Suggestions {
  connections: string[];
  creations: string[];
}

type SuggestionsCallback = (suggestions: Suggestions) => void;

export class SuggestionsService  {
  private debouncedGetSuggestions: any;

  constructor(
    private walletSelectionService: WalletSelectionService,
    {debounceTime} = {debounceTime: 1000},
  ) {
    this.debouncedGetSuggestions = debounce(this.doGetSuggestions.bind(this), debounceTime);
  }

  private async doGetSuggestions(name: string, callback: SuggestionsCallback) {
    const suggestions = await this.walletSelectionService.getSuggestions(name);
    if (suggestions) {
      callback(suggestions);
    } else {
      callback({connections: [], creations: []});
    }
  }

  getSuggestions = (name: string, callback: SuggestionsCallback) => {
    this.debouncedGetSuggestions(name, callback);
  }
}
