import React, {useState} from 'react';

interface HintProps {
  color: 'red' | 'yellow';
  children: string;
}

export const Hint = ({color, children}: HintProps) => {
  const [hintVisibility, setHintVisibility] = useState(true);

  if (hintVisibility) {
    return (
      <div className={`hint ${color}`}>
        <p className="hint-text">{children}</p>
        <button onClick={() => setHintVisibility(false)} className="hint-btn">Dismiss</button>
      </div>
    );
  }

  return null;
};
