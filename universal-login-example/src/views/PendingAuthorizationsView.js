import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PendingAuthorisationView from './PendingAuthorisationView';

class PendingAuthorizationsView extends Component {
  render() {
    if (this.props.authorisations.length === 0) {
      return (
        <div className="pending-authorizations">
          <em>There are no pending authorizations at the moment</em>
        </div>
      );
    }
    const authorisations = this.props.authorisations.map((authorisation) => (
      <PendingAuthorisationView
        key={`${authorisation.key}_${authorisation.label.time}`}
        authorisation={authorisation}
        onAcceptClick={this.props.onAcceptClick}
        onDenyClick={this.props.onDenyClick}
    />));

    return (
      <div className="pending-authorizations">
        <h1 className="main-title">Pending Authorizations</h1>
        <div className="container">
          <div className="container">
            {authorisations}
          </div>
        </div>
      </div>
    );
  }
}

PendingAuthorizationsView.propTypes = {
  authorisations: PropTypes.array,
  onAcceptClick: PropTypes.func,
  onDenyClick: PropTypes.func
};

export default PendingAuthorizationsView;
