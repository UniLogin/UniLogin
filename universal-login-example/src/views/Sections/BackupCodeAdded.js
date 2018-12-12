import React from 'react';
import PropTypes from 'prop-types';
import classnames from '../../helpers/classnames';

function BackupCodeAdded(props) {
  const classes = classnames({
    animated: props.status === 'fresh',
    'checkmark-ico': true,
    'icon-check': true,
    'order-3': true
  });
  return (
    <div className="row">
      <span className={classes} />
      <div>
        <strong>You printed your backup code</strong>
        <p>
          Received 10 <em>kliks</em>
        </p>
      </div>
    </div>
  );
}

BackupCodeAdded.propTypes = {
  status: PropTypes.string
};


export default BackupCodeAdded;
