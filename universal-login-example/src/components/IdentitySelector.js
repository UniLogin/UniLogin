import React, { Component } from 'react';
import TextBox from '../views/TextBox';
import PropTypes from 'prop-types';
import ConnectionHoverView from '../views/ConnectionHoverView';

class IdentitySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identity: '',
      connections: [],
      creations: []
    };
  }

  async update(event) {
    const identity = event.target.value;
    const [connections, creations] = await this.props.identitySelectionService.getSuggestions(event.target.value);
    this.setState({identity, connections, creations});
  }

  render() {
    return (
      <div>
        <h2> Type an username </h2>
        <div className="id-selector">
          <TextBox
            placeholder="bob.example.eth"
            onChange={e => this.update(e)}
          />
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
