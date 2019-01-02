import React, {Component} from 'react';
import TextBox from '../views/TextBox';
import PropTypes from 'prop-types';
import ConnectionHoverView from '../views/ConnectionHoverView';

class IdentitySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: '',
      connections: [],
      creations: [],      
      busy: false
    };
    const {suggestionsService} = this.props.services;
    this.suggestionsService = suggestionsService;
  }
  
  componentDidMount() {
    this.suggestionsService.setCallback(this.setState.bind(this));
  }

  async update(event) {
    const identity = event.target.value;
    this.suggestionsService.getSuggestions(identity);
  }

  renderBusyIndicator() {
    if (this.state.busy) {
      return <div className='circle-loader input-loader'> </div>;    
    } 
  }

  render() {
    return (
      <div>
        <h2> Type an username </h2>
        <div className="id-selector">
          <TextBox
            placeholder="bob.example.eth"
            onChange={(event) => this.update(event)}
          />          
          { this.renderBusyIndicator() }
        </div>
        <ConnectionHoverView
          connections={this.state.connections}
          creations={this.state.creations}
          identity={this.state.identity}
          onNextClick={this.props.onNextClick}
          onAccountRecoveryClick={this.props.onAccountRecoveryClick}
        />
        
      </div>
    );
  }
}

IdentitySelector.propTypes = {
  onChange: PropTypes.func,
  onNextClick: PropTypes.func,
  onAccountRecoveryClick: PropTypes.func,
  services: PropTypes.object,
  identitySelectionService: PropTypes.object
};

export default IdentitySelector;
