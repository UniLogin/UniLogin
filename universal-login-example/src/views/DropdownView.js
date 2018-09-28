import React, { Component } from "react";
import PropTypes from "prop-types";

class DropdownView extends Component {
  renderContent() {
    return this.props.content.map((item, i) => {
      return (
        <li
          key={i}
          onClick={e => this.props.handleItemClick(e)}
          className="dropdown-content-item"
        >
          {item}
        </li>
      );
    });
  }

  render() {
    return (
      <div className="dropdown">
        <button onClick={() => this.props.openList()} className="dropdown-btn">
          .{this.props.title}
        </button>
        {this.props.isListOpen ? (
          <ul className="dropdown-content">{this.renderContent()}</ul>
        ) : null}
      </div>
    );
  }
}

DropdownView.propTypes = {
  content: PropTypes.array,
  handleItemClick: PropTypes.func,
  openList: PropTypes.func,
  title: PropTypes.string,
  isListOpen: PropTypes.bool
};

export default DropdownView;
