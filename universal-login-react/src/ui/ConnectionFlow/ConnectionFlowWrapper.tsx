import React, {ReactNode} from 'react';
import {CompanyLogo} from '../commons/CompanyLogo';
import {ModalProgressBar} from '../commons/ModalProgressBar';
import {useClassFor, classForComponent} from '../utils/classFor';
import '../styles/base/connectionFlowWrapper.sass';

interface ConnectionFlowWrapperProps {
  children: ReactNode;
  progress?: number;
  steps?: number;
}

export const ConnectionFlowWrapper = ({children, progress, steps}: ConnectionFlowWrapperProps) => {
  return (
    <div className={useClassFor('connection-flow-wrapper')}>
      <CompanyLogo/>
      <div className={classForComponent('progress-wrapper')}>
        {progress && steps && <ModalProgressBar progress={progress} steps={steps}/>}
      </div>
      {children}
    </div>
  );
};
