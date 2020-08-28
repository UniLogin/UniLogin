import React, {useState, useEffect, ReactNode} from 'react';

export interface SnackBarProps {
  delay: number;
  element: ReactNode;
};

export interface SnackBarQueueProps {
  snackQueue: SnackBarProps[];
}

export const SnackQueueBar = ({snackQueue}: SnackBarQueueProps) => {
  const [showIndex, setShowIndex] = useState<number | null>(null);
  useEffect(() => {
    if (showIndex === null) {
      return setTimeoutForIndex(0);
    } else if (showIndex < snackQueue.length - 1) {
      return setTimeoutForIndex(showIndex + 1);
    }
  }, [showIndex]);

  const setTimeoutForIndex = (index: number) => {
    const timeout_id = setTimeout(() => setShowIndex(index), snackQueue[index].delay * 1000);
    return () => clearTimeout(timeout_id);
  }

  return <>
    {showIndex !== null ? snackQueue[showIndex].element : null}
  </>;
};
