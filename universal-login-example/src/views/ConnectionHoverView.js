import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ConnectionHoverView extends Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  focusItem(index) {
    this.listRef.current.children[index].children[1].focus();
  }

  render() {
    let offset = 0;
    const connections = this.props.connections.map((name, index) => (
      <li
        key={`connection_${name}`}
        onClick={() => this.props.onNextClick(name)}
        className={index + offset === this.props.selectedIndex ? 'active' : null}
      >
        <span className="walletContract">{name}</span>
        <button type="submit" className='connect'>connect</button>
      </li>
    ));
    offset = offset + connections.length;
    const creations = this.props.creations.map((name, index) => (
      <li
        key={`creation_${name}`}
        onClick={() => this.props.onNextClick(name)}
        className={index + offset === this.props.selectedIndex ? 'active' : null}
      >
        <span className="walletContract">{name}</span>
        <button className='create'>create</button>
      </li>
    ));
    offset = offset + creations.length;
    const recovers = this.props.connections.map((name, index) => (
      <li
        key={`recovery_${name}`}
        onClick={() => this.props.onAccountRecoveryClick(name)}
        className={index + offset === this.props.selectedIndex ? 'active' : null}
      >
        <span className="walletContract">{name}</span>
        <button className='recover'>recover</button>
      </li>
    ));

    return this.props.walletContract.length > 1 ? (
      <ul className="loginHover" onKeyDown={this.props.onKeyDown.bind(this)} ref={this.listRef}>
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
  walletContract: PropTypes.string,
  selectedIndex: PropTypes.number,
  onKeyDown: PropTypes.func
};

export default ConnectionHoverView;
