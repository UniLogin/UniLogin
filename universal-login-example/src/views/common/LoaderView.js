import React from 'react';
import PropTypes from 'prop-types';

const LoaderView = ({className}) => (
  <div className={`circle-loader ${className ? className : ''}`}/>
);

LoaderView.propTypes = {
  className: PropTypes.string
};

export default LoaderView;
