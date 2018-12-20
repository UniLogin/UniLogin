import React, {Component} from 'react';
import TextBox from '../views/TextBox';
import PropTypes from 'prop-types';
import ConnectionHoverView from '../views/ConnectionHoverView';
import {debounce} from '../utils';

class IdentitySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: '',
      connections: [],
      creations: [],      
      busy: false
    };
    this.debouncedGetSuggestions = debounce(this.getSuggestions.bind(this), 1000);
  }

  async getSuggestions(identity) {
    this.setState({busy: true});
    const [connections, creations] = await this.props.identitySelectionService.getSuggestions(identity);
    this.setState({identity, connections, creations, busy: false});
  }

  async update(event) {
    const identity = event.target.value;
    this.debouncedGetSuggestions(identity);
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
  ensDomains: PropTypes.arrayOf(PropTypes.string),
  services: PropTypes.object,
  identityExist: PropTypes.func,
  identitySelectionService: PropTypes.object
};

export default IdentitySelector;
