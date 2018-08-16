import React, { Component } from 'react';

class CollapsibleView extends Component {
  render() { 
    return ( 
      <div className="accordion">
        <div className={`accordion-btn ${this.props.isExpanded ? 'expanded' : ''}`}>
          <img className="accordion-btn-ico" src={this.props.icon} alt="icon"/>
          <button onClick={(e) => this.props.toggleAccordion(e)}>
            <h2 className="accordion-title">{this.props.title}</h2>
            <p className="accordion-subtitle">{this.props.subtitle}</p>
          </button>
        </div>
        <div className="accordion-content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
export default CollapsibleView;