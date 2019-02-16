import React, {useState} from 'react';
import chartImage from './../../assets/chartPlaceholder.svg';
import WyreComponent from './../WyreComponent'

const Chart = () => (
  <>
    <p className="chart-section-amount">$ 12,987.76</p>
    <div className="chart-row">
      <div className="chart">
        <img src={chartImage} alt=""/>
      </div>
      <div>
        <p className="chart-legend wbtc">wbtc</p>
        <p className="chart-legend eth">eth</p>
        <p className="chart-legend mkr">mkr</p>
        <p className="chart-legend else">else</p>
      </div>
    </div>
  </>
);

const BuyCryptoAssets = () => (
  <div className="buy-assets-block">
    <button className="btn buy-assets-btn">Buy crypto-assets</button>
    <p className="buy-assets-text">You can own multiple tokens and use them as a collateral for credit.</p>
  </div>
);

const ChartSection = () => {
  const [assets] = useState(true);

  return (
    <div className="box chart-section">
      <div className="chart-section-row">
        <div className="chart-section-block">
          <h2 className="chart-section-title">Cash (DAI)</h2>
          <p className="chart-section-amount">$ 1,235.9876352124</p>
          <p className="chart-section-text">You can spend up to US$ 9,464.25</p>
          <p> Buy DAI with Wyre </p>
          <WyreComponent />
        </div>
        <div className="chart-section-block">
          <h2 className="chart-section-title">Assets</h2>
          {assets ? <Chart /> : <BuyCryptoAssets /> }
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
