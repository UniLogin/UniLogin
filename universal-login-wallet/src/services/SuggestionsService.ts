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

  setCallback = (_callback: (...args: any[]) => void) => {
    this.callback = _callback;
  }

  doGetSuggestions = async (name: string) => {
    const suggestions = await this.identitySelectionService.getSuggestions(name);
    this.callback({...suggestions, identity: name, busy: false});
  }

  getSuggestions = (name: string) => {
    this.callback({busy: true});
    this.debouncedGetSuggestions(name);
  }
}

export default SuggestionsService;
