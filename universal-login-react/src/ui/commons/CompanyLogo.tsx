import React from 'react';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/companyLogo.sass';
import cx from 'classnames';

export interface CompanyLogoProps {
  className?: string;
}

export const CompanyLogo = ({className}: CompanyLogoProps) => (
  <div className={cx(useClassFor('company-logo'), className)}>
    <div className={classForComponent('logo-icon')}></div>
    <p className={classForComponent('logo-label')}>BETA</p>
  </div>
);
