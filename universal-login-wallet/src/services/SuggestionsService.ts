import {debounce} from './utils/utils';

class SuggestionsService  {
  identitySelectionService: any;
  callback: (...args: any[]) => void;
  debouncedGetSuggestions: any;

  constructor(identitySelectionService: any, {debounceTime} = {debounceTime: 1000}) {
    this.identitySelectionService = identitySelectionService;
    this.callback = () => {};
    this.debouncedGetSuggestions = debounce(this.doGetSuggestions.bind(this), debounceTime);
  }

  setCallback = (callback: (...args: any[]) => void) => {
    this.callback = callback;
  }

  async doGetSuggestions(name: string) {
    const suggestions = await this.identitySelectionService.getSuggestions(name);
    this.callback({...suggestions, name, busy: false});
  }

  getSuggestions = (name: string) => {
    this.callback({busy: true});
    this.debouncedGetSuggestions(name);
  }
}

export default SuggestionsService;
