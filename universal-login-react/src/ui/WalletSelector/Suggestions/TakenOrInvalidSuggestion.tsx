import React from 'react';
import {classForComponent} from '../../utils/classFor';

export const TakenOrInvalidSuggestion = () => (
  <div className={classForComponent('hint')}>Name is already taken or is invalid</div>
);
