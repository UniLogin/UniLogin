import React from 'react';

interface CloseButtonProps {
  onClick: () => void
}

export const CloseButton = ({onClick}: CloseButtonProps) => <button onClick={onClick} className="close-button" />
