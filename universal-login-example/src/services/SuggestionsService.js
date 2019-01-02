import {debounce} from '../../src/utils';

export default class SuggestionsService {
  constructor(identitySelectionService, {debounceTime} = {debounceTime: 1000}) {
    this.identitySelectionService = identitySelectionService;
    this.debouncedGetSuggestions = debounce(this.doGetSuggestions.bind(this), debounceTime);
  }

  setCallback(callback) {
    this.callback = callback;
  }

  async doGetSuggestions(name) {
    const suggestions = await this.identitySelectionService.getSuggestions(name);
    this.callback({...suggestions, identity: name, busy: false});
  }

  getSuggestions(name) {
    this.callback({busy: true});
    this.debouncedGetSuggestions(name);
  }
}
