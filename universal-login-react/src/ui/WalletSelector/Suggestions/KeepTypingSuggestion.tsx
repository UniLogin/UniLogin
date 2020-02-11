import React from 'react';
import {classForComponent} from '../../utils/classFor';

export const KeepTypingSuggestion = () => (
  <ul className={classForComponent('suggestions-list')}>
    <li className={classForComponent('suggestions-item')}>
      <p className={classForComponent('suggestions-hint')}>Nickname is too short. Type minimum 3 letters</p>
    </li>
  </ul>
);
