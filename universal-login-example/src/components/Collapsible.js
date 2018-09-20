import React, { Component } from 'react';
import CollapsibleView from '../views/CollapsibleView';
import PropTypes from 'prop-types';

class Collapsible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false
    };
  }

  toggleAccordion() {
    this.setState({
      isExpanded: !this.state.isExpanded
    });
  }

  render() {
    return (
      <CollapsibleView
        title={this.props.title}
        subtitle={this.props.subtitle}
        icon={this.props.icon}
        toggleAccordion={this.toggleAccordion.bind(this)}
        isExpanded={this.state.isExpanded}
      >
        {this.props.children}
      </CollapsibleView>
    );
  }
}

Collapsible.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node
};

export default Collapsible;
