import React from 'react';
import TextBox from './TextBox';
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
      busy: false
    }
  }
  
  componentDidMount() {
    this.suggestionsService.setCallback(this.setState.bind(this));
  }
  
  async update(event: any) {
    const name = event.target.value;
    this.suggestionsService.getSuggestions(name);
  };

  renderBusyIndicator() {
    if (this.state.busy) {
      return <div className='circle-loader input-loader'> </div>;
    }
  }

  render() {
    return(
      <div className="identity-selector">
        <div className="id-selector">
          <TextBox onChange={this.update.bind(this)} placeholder={'bob.example.eth'}/>
          { this.renderBusyIndicator() }
        </div>
        <Suggestions
          connections={this.state.connections}
          creations={this.state.creations}
        />
      </div>
    );
  }
}

export default IdentitySelector;
