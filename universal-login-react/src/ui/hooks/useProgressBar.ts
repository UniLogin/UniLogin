import {useState} from 'react';

export const useProgressBar = () => {
  const [progressBar, setProgressBar] = useState(false);

  return {
    progressBar,
    showProgressBar: () => setProgressBar(true),
    hideProgressBar: () => setProgressBar(false)
  };
};
