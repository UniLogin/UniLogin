import React, {Component} from 'react';
import DropdownView from '../views/DropdownView';
import PropTypes from 'prop-types';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isListOpen: false,
      content: this.props.dropdownContent,
      title: this.props.title || 'Select item'
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.title !== this.state.title) {
      this.props.returnValue(this.state.title);
    }
  }

  handleItemClick(event) {
    this.setState({
      isListOpen: false,
      title: event.target.textContent
    });
  }

  openList() {
    this.setState({
      isListOpen: true
    });
  }

  render() {
    return (
      <DropdownView
        openList={this.openList.bind(this)}
        handleItemClick={this.handleItemClick.bind(this)}
        isListOpen={this.state.isListOpen}
        content={this.state.content}
        title={this.state.title}
      />
    );
  }
}

Dropdown.propTypes = {
  dropdownContent: PropTypes.array,
  title: PropTypes.string,
  returnValue: PropTypes.func
};

export default Dropdown;
