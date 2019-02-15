import React from 'react';
import TextBox from './TextBox';
import Suggestions from './Suggestions';

class IdentitySelector extends React.Component<any, any> {
  identitySelectionService: any;
  constructor(props: {services: any}) {
    super(props);
    this.identitySelectionService = props.services.identitySelectionService;
    this.state = {
      connections: [],
      creations: []
    }
  }

  async update(event: any) {
    const identity = event.target.value;
    console.log(identity);
    this.identitySelectionService.getSuggestions(identity);
  };

  render() {
    return(
      <div className="identity-selector">
        <TextBox onChange={this.update} placeholder={'bob.example.eth'}/>
        <Suggestions
          connections={['name.my-id.eth']}
          creations={['name.super-id.eth']}
          recovers={['name.mylogin.eth']}
        />
      </div>
    );
  }
}

export default IdentitySelector;
