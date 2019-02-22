import {debounce} from '../utils/debounce';
import {Procedure} from '../utils/types';
import {IdentitySelectionService} from './IdentitySelectionService';

export class SuggestionsService  {
  debouncedGetSuggestions: any;

  constructor(
    private identitySelectionService: IdentitySelectionService,
    {debounceTime} = {debounceTime: 1000}
  ) {
    this.debouncedGetSuggestions = debounce(this.doGetSuggestions.bind(this), debounceTime);
  }

  private async doGetSuggestions(name: string, callback: Procedure) {
    const suggestions = await this.identitySelectionService.getSuggestions(name);
    callback({...suggestions, name, busy: false});
  }

  getSuggestions = (name: string, callback: Procedure) => {
    callback({busy: true});
    this.debouncedGetSuggestions(name, callback);
  }
}


