import React from 'react';
import {classForComponent} from '../../utils/classFor';

export const KeepTypingSuggestion = () => (
  <ul className={classForComponent('suggestions-list')}>
    <li className={classForComponent('suggestions-item')}>
      <p className={classForComponent('suggestions-hint')}>This name is too short. Keep typing..</p>
    </li>
  </ul>
);
