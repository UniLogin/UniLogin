import Relayer from '../../http/relayers/Relayer';
import {RefundPayer} from '../models/RefundPayer';
import {RefundPayerStore} from '../../integration/sql/services/RefundPayerStore';

export const addRefundPayer = (relayer: Relayer, refundPayer: RefundPayer) =>
  new RefundPayerStore(relayer.database).add(refundPayer);
