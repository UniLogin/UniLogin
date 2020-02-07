import {MAX_PROGRESS_BAR_WIDTH} from '../constants/maxProgressBarWidth';

export const getModalProgressWidth = (progress: number, steps: number) => {
  return progress / steps * MAX_PROGRESS_BAR_WIDTH;
};
