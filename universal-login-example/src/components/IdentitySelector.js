import React, {Component} from 'react';
import TextBox from '../views/TextBox';
import PropTypes from 'prop-types';
import ConnectionHoverView from '../views/ConnectionHoverView';

class IdentitySelector extends Component {
  constructor(props) {
    super(props);

    this.textBox = React.createRef();
    this.connectionHoverViewRef = React.createRef();
    this.state = {
      identity: '',
      connections: [],
      creations: [],
      busy: false
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

  renderBusyIndicator() {
    if (this.state.busy) {
      return <div className='circle-loader input-loader'> </div>;
    }
  }

  async moveFocusToConnectionHoverView() {
    const connectionList = this.connectionHoverViewRef.current.listRef.current;
    if (connectionList.children.length > 0) {
      this.connectionHoverViewRef.current.setState({selectedIndex: 0});
      const [firstConnectionItem] = connectionList.children;
      const [, firstConnectionItemButton] = firstConnectionItem.children;
      firstConnectionItemButton.focus();
    }
  }

  async moveFocusToTextBox() {
    const input = this.textBox.current;
    input.focus();
    setTimeout(() => input.setSelectionRange(input.value.length, input.value.length), 0);
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
            onArrowDownKeyPressed={this.moveFocusToConnectionHoverView.bind(this)}
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
          onLastArrowUpKeyPressed={this.moveFocusToTextBox.bind(this)}
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
