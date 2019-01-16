import React, {Component} from 'react';
import TextBox from '../views/TextBox';
import PropTypes from 'prop-types';
import ConnectionHoverView from '../views/ConnectionHoverView';

const KEY_CODE_ARROW_UP = 38;
const KEY_CODE_ARROW_DOWN = 40;

class IdentitySelector extends Component {
  constructor(props) {
    super(props);
    this.textBox = React.createRef();
    this.connectionHoverViewRef = React.createRef();
    this.state = {
      identity: '',
      connections: [],
      creations: [],
      busy: false,
      selectedIndex: -1
    };
    const {suggestionsService} = this.props.services;
    this.suggestionsService = suggestionsService;
  }

  componentDidMount() {
    this.suggestionsService.setCallback(this.setState.bind(this));
  }

  async update(event) {
    const identity = event.target.value;
    this.suggestionsService.getSuggestions(identity);
  }

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.selectedIndex === this.state.selectedIndex) {
      return;
    }
    if (this.state.selectedIndex >= 0) {
      this.connectionHoverViewRef.current.focusItem(this.state.selectedIndex);
    } else {
      this.moveFocusToTextBox();
    }
  }

  async moveSelection(event) {
    const {connections, creations} = this.state;
    const {selectedIndex} = this.state;
    const length = (2 * connections.length) + creations.length;
    if (event.keyCode === KEY_CODE_ARROW_UP) {
      if (selectedIndex > 0) {
        this.setState({selectedIndex: selectedIndex - 1});
      } else {
        this.setState({selectedIndex: -1});
      }
    } else if (event.keyCode === KEY_CODE_ARROW_DOWN && selectedIndex < length - 1) {
      this.setState({selectedIndex: selectedIndex + 1});
    }
  }

  async moveFocusToConnectionHoverView(event) {
    if (event.keyCode === KEY_CODE_ARROW_DOWN) {
      this.moveSelection(event);
    }
  }

  async moveFocusToTextBox() {
    const input = this.textBox.current;
    input.focus();
    setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
  }

  renderBusyIndicator() {
    if (this.state.busy) {
      return <div className='circle-loader input-loader'> </div>;
    }
  }

  render() {
    return (
      <div>
        <h2> Type an username </h2>
        <div className="id-selector">
          <TextBox
            placeholder="bob.example.eth"
            maxlength={24}
            onChange={(event) => this.update(event)}
            onKeyDown={this.moveFocusToConnectionHoverView.bind(this)}
            ref={this.textBox}
          />
          { this.renderBusyIndicator() }
        </div>
        <ConnectionHoverView
          connections={this.state.connections}
          creations={this.state.creations}
          identity={this.state.identity}
          onNextClick={this.props.onNextClick}
          onAccountRecoveryClick={this.props.onAccountRecoveryClick}
          onKeyDown={this.moveSelection.bind(this)}
          selectedIndex={this.state.selectedIndex}
          ref={this.connectionHoverViewRef}
        />
      </div>
    );
  }
}

IdentitySelector.propTypes = {
  onChange: PropTypes.func,
  onNextClick: PropTypes.func,
  onAccountRecoveryClick: PropTypes.func,
  services: PropTypes.object,
  identitySelectionService: PropTypes.object
};

export default IdentitySelector;
