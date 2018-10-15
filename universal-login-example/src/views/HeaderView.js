import React, {Component} from 'react';
import PropTypes from 'prop-types';

class HeaderView extends Component {
  render() {
    return <header className="header">{this.props.children}</header>;
  }
}

HeaderView.propTypes = {
  children: PropTypes.node
};

export default HeaderView;
