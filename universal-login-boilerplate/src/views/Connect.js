import React, {Component} from 'react';
import TextBox from './TextBox';
import PropTypes from 'prop-types';

class Connect extends Component {
  render() {
    return (
      <div>
        <h2> Type an username </h2>
        <div className="id-selector">
          <TextBox
            placeholder="bob"
            onChange={this.props.onChange.bind(this)}
          /> .mylogin.eth
        </div>

        <button onClick={this.props.onNextClick.bind(this)}>Connect</button>
      </div>
    );
  }
}

Connect.propTypes = {
  onNextClick: PropTypes.func,
  onChange: PropTypes.func
};

export default Connect;
