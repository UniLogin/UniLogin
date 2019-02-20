import React from 'react';
import InputText from '../common/InputText';
import Suggestions from './Suggestions';

class IdentitySelector extends React.Component<any, any> {
  identitySelectionService: any;
  suggestionsService: any;

  constructor(props: {services: any}) {
    super(props);
    this.identitySelectionService = props.services.identitySelectionService;
    this.suggestionsService = props.services.suggestionsService;
    this.state = {
      name: '',
      connections: [],
      creations: [],
      busy: false,
    };
  }

  componentDidMount() {
    this.suggestionsService.setCallback(this.setState.bind(this));
  }

  update(event: any) {
    const name = event.target.value;
    this.suggestionsService.getSuggestions(name);
  }

  renderSuggestions() {
    const {busy, connections, creations} = this.state;
    if (busy) {
      return <div className="circle-loader input-loader"/>;
    }
    if (!connections.length && !creations.length) {
      return null;
    }
    return <Suggestions connections={connections} creations={creations} />;
  }

  render() {
    return(
      <>
        <label htmlFor="loginInput" className="login-input-label">
          <p className="login-input-label-title">Type a nickname you want</p>
          <p className="login-input-label-text">(Or your current username if you’re already own one)</p>
        </label>
        <InputText
          id="loginInput"
          onChange={event => this.update(event)}
          placeholder="bob.example.eth"
        />
        {this.renderSuggestions()}
      </>
    );
  }
}

export default IdentitySelector;
