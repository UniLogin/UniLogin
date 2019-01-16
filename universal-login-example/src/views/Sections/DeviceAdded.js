import React from 'react';
import PropTypes from 'prop-types';
import classnames from '../../helpers/classnames';

function DeviceAdded(props) {
  const classes = classnames({
    animated: props.status === 'fresh',
    'checkmark-ico': true,
    'icon-check': true,
    'order-2': true
  });

  return (
    <div className="row">
      <span className={classes} />
      <div>
        <strong>You added a new device</strong>
        <p>
          Received 5 <em>kliks</em>
        </p>
      </div>
    </div>
  );
}

DeviceAdded.propTypes = {
  status: PropTypes.string
};


export default DeviceAdded;
