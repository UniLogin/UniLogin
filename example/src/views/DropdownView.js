import React, {Component} from 'react';

class DropdownView extends Component {
  
  renderContent() {
    return this.props.content.map( (item,i) =>{
      return (
        <li
          key={i}
          onClick={(e) => this.props.handleItemClick(e)}
          className="dropdown-content-item"
        >
          {item}
        </li>
      )
    })
  }
  
  render() {
    return (
      <div className="dropdown">
    <button onClick={() => this.props.openList()} className="dropdown-btn">{this.props.title}</button>
    {this.props.isListOpen ? 
      <ul className="dropdown-content">
        {this.renderContent()}
      </ul>
      : null
    }
    </div>
    );
  }
}

export default DropdownView;
