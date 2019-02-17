import React, {useState} from 'react';
import chartImage from './../../assets/chartPlaceholder.svg';
import {utils} from 'ethers';

const Chart = (props: any) => (
  <div>
    <p className="chart-section-amount">$ {utils.formatEther(props.balance) / 10}</p>
    <div className="chart-row">
      <div className="chart">
        <img src={chartImage} alt=""/>
      </div>
      <div>
        <p className="chart-legend eth">dai</p>
      </div>
    </div>
  </div>
);

const BuyCryptoAssets = () => (
  <div className="buy-assets-block">
    <button className="btn buy-assets-btn">Buy crypto-assets</button>
    <p className="buy-assets-text">You can own multiple tokens and use them as a collateral for credit.</p>
  </div>
);

const ChartSection = (props: any) => {
  const [assets] = useState(true);

  return (
    <div className="box chart-section">
      <div className="chart-section-row">
        <div className="chart-section-block">
          <h2 className="chart-section-title">Cash (DAI)</h2>
          <p className="chart-section-amount">$ {utils.formatEther(props.balance) / 10}</p>
          <p className="chart-section-text">You can spend up to US$ {utils.formatEther(props.balance) / 10}</p>
        </div>
        <div className="chart-section-block">
          <h2 className="chart-section-title">Assets</h2>
          {assets ? <Chart balance= {props.balance}/> : <BuyCryptoAssets />}
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
