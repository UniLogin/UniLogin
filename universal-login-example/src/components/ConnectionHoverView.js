import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ConnectionHoverView extends Component {
  render() {
    const connections = this.props.connections.map((name) => (
      <li key={`connection_${name}`} className="active" onClick={() => this.props.onNextClick(name)}>
        <span className="identity">{name}</span>
        <button type="submit">connect</button>
      </li>
    ));
    const creations = this.props.creations.map((name) => (
      <li key={`creation_${name}`} onClick={() => this.props.onNextClick(name)}>
        <span className="identity">{name}</span>
        <button>create</button>
      </li>
    ));
    const recovers = this.props.connections.map((name) => (
      <li key={`recovery_${name}`}>
        <span className="identity">{name}</span>
        <button>recover</button>
      </li>
    ));

    return this.props.identity.length > 1 ? (
      <ul className="loginHover">
        { connections }
        { creations }
        { recovers }
      </ul>
    ) : (
      ''
    );
  }
}

ConnectionHoverView.propTypes = {
  connections: PropTypes.arrayOf(PropTypes.string),
  creations: PropTypes.arrayOf(PropTypes.string),
  onNextClick: PropTypes.function,
  identity: PropTypes.string
};

export default ConnectionHoverView;
