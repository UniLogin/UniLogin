import React, {Component} from 'react';
import PropTypes from 'prop-types';

class CollapsibleView extends Component {
  render() {
    return (
      <div className="accordion">
        <div className={`accordion-btn ${this.props.isExpanded ? 'expanded' : ''}`}>
          <span className={`accordion-btn-ico ${this.props.icon}`}></span>
          <button onClick={(event) => this.props.toggleAccordion(event)}>
            <h2 className="accordion-title">{this.props.title}</h2>
            <p className="accordion-subtitle">{this.props.subtitle}</p>
          </button>
        </div>
        <div className="accordion-content">{this.props.children}</div>
      </div>
    );
  }
}

CollapsibleView.propTypes = {
  isExpanded: PropTypes.bool,
  toggleAccordion: PropTypes.func,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node
};

export default CollapsibleView;
