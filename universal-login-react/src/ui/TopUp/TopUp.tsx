import React from 'react';
import {TopUpClassName} from '../../core/models/TopUpClassName';

export const TopUp = (topUpClassName: TopUpClassName) => (
  <div className={`top-up-${topUpClassName}`}>Top Up</div>
);

