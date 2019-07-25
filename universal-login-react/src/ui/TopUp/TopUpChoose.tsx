import React, {useState, useEffect} from 'react';
import TopUpModalService, {TopUpModalType} from '../../core/services/TopUpModalService';
import {Safello} from '../../integration/Safello';

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
      return(
        <div>
          <Safello
            localizationConfig={{} as any}
            safelloConfig={{
              appId: '1234-5678',
              baseAddress: 'https://app.s4f3.io/sdk/quickbuy.html',
              addressHelper: true
            }}
            contractAddress={contractAddress}
            crypto="eth"
          />
          <div onClick={() => topUpModalService.showModal(TopUpModalType.choose)}> Menu</div>
        </div>
      );
    case TopUpModalType.creditcard:
      return(<div onClick={() => topUpModalService.showModal(TopUpModalType.choose)}> creditcard</div>);
    case TopUpModalType.crypto:
      return(<div onClick={() => topUpModalService.showModal(TopUpModalType.choose)}> Transfer crypto to your wallet: {contractAddress} </div>);
    default:
      return(null);
  }
};

export default TopUpChoose;
