import React from 'react';
import Collapsible from '../components/Collapsible';
import GroupIco from '../img/users.svg';
import PropTypes from 'prop-types';

const TrustedFriendsView = props => (
  <Collapsible
    title="Trusted friends recovery"
    subtitle="You have 5 friends configured"
    icon={GroupIco}
  >
    <p className="advice-text">
      If you lose all your means of recovery, you can appoint a number of other
      accounts that, together, are able to recover access to your account
    </p>
    <button onClick={() => props.setView('Trusted')} className="btn fullwidth">
      Select new trusted friends
    </button>
  </Collapsible>
);

TrustedFriendsView.propTypes = {
  setView: PropTypes.func
};

export default TrustedFriendsView;
