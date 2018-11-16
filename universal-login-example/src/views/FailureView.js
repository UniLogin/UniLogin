import React, {Component} from 'react';
import PropTypes from 'prop-types';

class FailureView extends Component {
  render() {
    const {errorMessage} = this.props;
    return (
      <div className="failure-view">
        <div className="container">
          <h2>Cannot create your account</h2>
          <p>
            {errorMessage}
          </p>
          <button className="btn fullwidth back-btn" onClick={this.props.onBackClick.bind(this)}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }
}

FailureView.propTypes = {
  errorMessage: PropTypes.string,
  onBackClick: PropTypes.func
};

export default FailureView;
