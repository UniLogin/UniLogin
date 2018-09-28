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

  renderConnectHover() {
    return this.state.prefix.length > 1 ? (
      <ul className="loginHover">
        <li className="active">
          <span className="identity">{this.state.identity}</span>
          <button onClick={this.props.onNextClick.bind(this)} type="submit">
            {this.state.identityExist ? ' connect' : ' create'}
          </button>
        </li>
        <li>
          <span className="identity">
            {this.state.prefix}
            .alternatedomain.eth
          </span>
          <button> create new</button>
        </li>{' '}
        <li>
          <span className="identity">
            {this.state.prefix}
            .popularapp.eth
          </span>
          <button> connect </button>
        </li>{' '}
        <li>
          <span className="identity">
            {this.state.prefix}
            .my-id.eth
          </span>
          <button> create new</button>
        </li>
        <li className={this.state.identityExist ? 'visible' : 'hidden'}>
          <span className="identity">{this.state.identity}</span>
          <button>Recover identity</button>
        </li>
      </ul>
    ) : (
      ''
    );
  }

  async updatePrefix(event) {
    const inputText = event.target.value.toLowerCase().replace(/[ @]/, '');
    event.target.value = inputText;
    const prefix = inputText;
    const identity = !!inputText.match(/\.eth$/)
      ? inputText
      : !!inputText.match(/\./)
        ? `${prefix}.eth`
        : `${prefix}.${this.state.suffix}`;
    const identityExist = !!(await this.props.identityExist(identity));
    this.setState({ prefix, identity, identityExist });
    this.props.onChange(identity);
  }

  async updateSuffix(value) {
    const suffix = value;
    const identity = `${this.state.prefix}.${suffix}`;
    const identityExist = !!(await this.props.identityExist(identity));
    this.setState({ suffix, identity, identityExist });
    this.props.onChange(identity);
  }

  render() {
    return (
      <div>
        <h2> Type an username </h2>
        <div className="id-selector">
          <TextBox
            placeholder="bob.example.eth"
            onChange={e => this.updatePrefix(e)}
          />
        </div>
        {this.renderConnectHover()}
      </div>
    );
  }
}

IdentitySelector.propTypes = {
  onChange: PropTypes.func,
  onNextClick: PropTypes.func,
  ensDomains: PropTypes.arrayOf(PropTypes.string),
  services: PropTypes.object,
  identityExist: PropTypes.func
};

export default IdentitySelector;
