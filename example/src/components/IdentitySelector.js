import React, { Component } from 'react';
import IdentityExistingIndicator from '../views/IdentityExistingIndicator';
import TextBox from '../views/TextBox';
import Button from './Button';
import Dropdown from './Dropdown';

const suffixes = [
  '.universal-id.eth',
  '.mylogin.eth',
  '.popularapp.eth',
  '.eth'
]

class IdentitySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: '',
      suffix: suffixes[0],
      identity: '',
      identityExist: false
    };
  }

  identityExist(identity) {
    return identity === 'alex.universal-id.eth';
  }

  updatePrefix(event) {
    const identity = `${e.target.value}${this.state.suffix}`;
    this.setState({
      prefix: event.target.value,
      identity,
      identityExist: this.identityExist(identity)
    });
  }

  updateSuffix(value) {
    const identity = `${this.state.prefix}${value}`;
    this.setState({
      suffix: value,
      identity,
      identityExist: this.identityExist(identity)
    });
  }

  render() {
    return (
      <div>
        <IdentityExistingIndicator exist={this.state.identityExist}/>
        <div className="id-selector">
          <TextBox placeholder="type an username" onChange={(e) => this.updatePrefix(e)}/>
          <Dropdown
            returnValue={this.updateSuffix.bind(this)}
            title={suffixes[0]}
            dropdownContent={suffixes}
          />
        </div>
        <Button onClick={() => this.props.setView('CreatingID')}>Next</Button>
      </div>
    );
  }
}

export default IdentitySelector;