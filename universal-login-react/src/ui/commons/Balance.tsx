import React from 'react';
// import './../styles/balance.sass';
// import './../styles/balanceDefault.sass';
import './../styles/base/balance.sass';
import './../styles/themes/Legacy/balanceThemeLegacy.sass';
import './../styles/themes/UniLogin/balanceThemeUniLogin.sass';
import {getStyleForTopLevelComponent} from '../../core/utils/getStyleForTopLevelComponent';
import {formatCurrency} from '../../core/utils/formatCurrency';
import Spinner from './Spinner';
import {useClassFor, classForComponent} from '../utils/classFor';
import {PrimaryButton} from './buttons/PrimaryButton';

export interface BalanceProps {
  amount: number | undefined;
  className?: string;
}

export const Balance = ({amount, className}: BalanceProps) => {
  return (
    <div className={useClassFor('user-balance')}>
      <div className={getStyleForTopLevelComponent(className)}>
        <div className={classForComponent('balance')}>
          {amount === undefined
            ? <div className={classForComponent('balance-spinner-wrapper')}>
              <Spinner className={classForComponent('balance-spinner')} />
            </div>
            : <>
              <p className={classForComponent('balance-text')}>Balance</p>
              <p className={classForComponent('balance-amount')}>{formatCurrency(amount.toString())}</p>
            </>
          }
        </div>
      </div>
    </div>
  );
};
