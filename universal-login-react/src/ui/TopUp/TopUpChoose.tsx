import React, {useState, useEffect} from 'react';
import TopUpModalService, {TopUpModalType} from '../../core/services/TopUpModalService';

interface TopUpChooseProps {
  topUpModalService: TopUpModalService;
  contractAddress: string;
}
export const TopUpChoose = ({contractAddress, topUpModalService}: TopUpChooseProps) => {
  const [openModal, setEvent] = useState<TopUpModalType>(TopUpModalType.choose);
  useEffect(() => topUpModalService.subscribe(setEvent), []);

  switch (openModal) {
    case TopUpModalType.choose:
      return(
        <div>
          <div onClick={() => topUpModalService.showModal(TopUpModalType.creditcard)}> creditcard</div>
          <div onClick={() => topUpModalService.showModal(TopUpModalType.bank)}> bank</div>
          <div onClick={() => topUpModalService.showModal(TopUpModalType.crypto)}> crypto</div>
        </div>
      );
    case TopUpModalType.bank:
      return(<div onClick={() => topUpModalService.showModal(TopUpModalType.choose)}> bank</div>);
    case TopUpModalType.creditcard:
      return(<div onClick={() => topUpModalService.showModal(TopUpModalType.choose)}> creditcard</div>);
    case TopUpModalType.crypto:
      return(<div onClick={() => topUpModalService.showModal(TopUpModalType.choose)}> Transfer crypto to your wallet: {contractAddress} </div>);
    default:
      return(null);
  }
};

export default TopUpChoose;
