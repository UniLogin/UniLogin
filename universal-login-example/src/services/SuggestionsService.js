import {debounce} from 'universal-login-commons';

export default class SuggestionsService {
  constructor(walletSelectionService, {debounceTime} = {debounceTime: 1000}) {
    this.walletSelectionService = walletSelectionService;
    this.debouncedGetSuggestions = debounce(this.doGetSuggestions.bind(this), debounceTime);
  }

  setCallback(callback) {
    this.callback = callback;
  }

  async doGetSuggestions(name) {
    const suggestions = await this.walletSelectionService.getSuggestions(name);
    this.callback({...suggestions, walletContract: name, busy: false});
  }

  getSuggestions(name) {
    this.callback({busy: true});
    this.debouncedGetSuggestions(name);
  }
}
