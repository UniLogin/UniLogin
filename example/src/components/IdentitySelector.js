import React, { Component } from 'react';
import IdentityExistingIndicator from '../views/IdentityExistingIndicator';
import TextBox from '../views/TextBox';
import Button from './Button';
import Dropdown from './Dropdown';
import PropTypes from 'prop-types';

class IdentitySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: '',
      suffix: this.props.ensDomains[0],
      identity: '',
      identityExist: false
    };
  }

  identityExist(identity) {
    return identity === 'alex.universal-id.eth';
  }

  updatePrefix(event) {
    const identity = `${event.target.value}.${this.state.suffix}`;
    this.setState({
      prefix: event.target.value,
      identity,
      identityExist: this.identityExist(identity)
    });
    this.props.onChange(identity);
  }

  updateSuffix(value) {
    const identity = `${this.state.prefix}.${value}`;
    this.setState({
      suffix: value,
      identity,
      identityExist: this.identityExist(identity)
    });
    this.props.onChange(identity);
  }

  render() {
    return (
      <div>
        <IdentityExistingIndicator exist={this.state.identityExist} />
        <div className="id-selector">
          <TextBox
            placeholder="type an username"
            onChange={e => this.updatePrefix(e)}
          />
          <Dropdown
            returnValue={this.updateSuffix.bind(this)}
            title={this.props.ensDomains[0]}
            dropdownContent={this.props.ensDomains}
          />
        </div>
        <Button onClick={this.props.onNextClick.bind(this) }>Next</Button>
      </div>
    );
  }
}

IdentitySelector.propTypes = {
  onChange: PropTypes.func,
  onNextClick: PropTypes.func,
  ensDomains: PropTypes.arrayOf(PropTypes.string)
};

export default IdentitySelector;
