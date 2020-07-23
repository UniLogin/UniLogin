import React, {useState} from 'react';

export interface EmailFlowCodeProps {
  onConfirm: () => void;
  onBack: () => void;
  onCodeChange: () => void;
}

export const EmailFlowCode = ({onConfirm, onCodeChange, onBack}: EmailFlowCodeProps) => {
  const [code, setCode] = useState('');

  <div>

  </div>
};
