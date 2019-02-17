import React from 'react';
import TextBox from './TextBox';
import Suggestions from './Suggestions';

class IdentitySelector extends React.Component<any, any> {
  identitySelectionService: any;
  suggestionsService: any;

  constructor(props: {services: any, onItemClick: any}) {
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

  renderBusyIndicator() {
    if (this.state.busy) {
      return <div className="circle-loader input-loader"/>;
    }
  }

  render() {
    return(
      <div className="identity-selector">
        <div className="id-selector">
          <TextBox
            onChange={event => this.update(event)}
            placeholder={'bob.example.eth'}
          />
          {this.renderBusyIndicator()}
        </div>
        <Suggestions
          connections={this.state.connections}
          creations={this.state.creations}
          onItemClick={this.props.onItemClick}
        />
      </div>
    );
  }
}

export default IdentitySelector;
