import React, {Component} from 'react';
import PropTypes from 'prop-types';

const KEY_CODE_ARROW_KEY_UP = 38;
const KEY_CODE_ARROW_KEY_DOWN = 40;

class ConnectionHoverView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }

  async moveSelection(event) {
    const list = event.currentTarget;
    const {connections, creations} = this.props;
    const {selectedIndex} = this.state;
    const length = (2 * connections.length) + creations.length;
    let activeItem;
    if (event.keyCode === KEY_CODE_ARROW_KEY_UP && selectedIndex > 0) {
      this.setState({selectedIndex: selectedIndex - 1});
      activeItem = list.children[selectedIndex - 1];
    } else if (event.keyCode === KEY_CODE_ARROW_KEY_DOWN && selectedIndex < length - 1) {
      this.setState({selectedIndex: selectedIndex + 1});
      activeItem = list.children[selectedIndex + 1];
    } else {
      activeItem = list.children[selectedIndex];
    }
    activeItem.children[1].focus();
  }

  render() {
    let offset = 0;
    const connections = this.props.connections.map((name, index) => (
      <li
        key={`connection_${name}`}
        onClick={() => this.props.onNextClick(name)}
        className={index + offset === this.state.selectedIndex ? 'active' : null}
      >
        <span className="identity">{name}</span>
        <button type="submit">connect</button>
      </li>
    ));
    offset = offset + connections.length;
    const creations = this.props.creations.map((name, index) => (
      <li
        key={`creation_${name}`}
        onClick={() => this.props.onNextClick(name)}
        className={index + offset === this.state.selectedIndex ? 'active' : null}
      >
        <span className="identity">{name}</span>
        <button>create</button>
      </li>
    ));
    offset = offset + creations.length;
    const recovers = this.props.connections.map((name, index) => (
      <li
        key={`recovery_${name}`}
        onClick={() => this.props.onAccountRecoveryClick(name)}
        className={index + offset === this.state.selectedIndex ? 'active' : null}
      >
        <span className="identity">{name}</span>
        <button>recover</button>
      </li>
    ));

    return this.props.identity.length > 1 ? (
      <ul className="loginHover" onKeyDown={(event) => this.moveSelection(event)}>
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
  onNextClick: PropTypes.func,
  onAccountRecoveryClick: PropTypes.func,
  identity: PropTypes.string
};

export default ConnectionHoverView;
