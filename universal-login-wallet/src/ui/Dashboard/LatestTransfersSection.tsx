import React, {useState} from 'react';
import ethIcon from './../../assets/ethereum-icon.svg';
import mkrIcon from './../../assets/maker-icon.svg';

const TableRow = ({data} : {data: any}) => (
  <tr className="tr" key={data.id}>
    <td className="td">
      <div className="currency-row">
        <img src={data.icon} alt={data.currency} className="currency-icon"/>
        <div>
          <p className="currency-name">{data.currency}</p>
          <p className="currency-shortcut">{data.shortcut}</p>
        </div>
      </div>
    </td>
    <td className="td">{data.address}</td>
    <td className="td">
      <p className="amount-usd">-$ {data.amountUsd.toFixed(2)}</p>
      <p className="amount-crypto">-{data.amountEth} {data.shortcut}</p>
    </td>
    <td className="td">{data.date}</td>
    <td className="td">
      <p className={`status ${data.status}`}>{data.status}</p>
    </td>
  </tr>
);

const Table = ({rows} : {rows: any}) => (
  <table className="table">
    <tbody>
      <tr className="tr">
        <th className="th">Currency</th>
        <th className="th">Sent Address</th>
        <th className="th">Amount</th>
        <th className="th">Date</th>
        <th className="th">Status</th>
      </tr>

      {rows.map((row: any) => <TableRow key={row.id} data={row}/>)}

    </tbody>
  </table>
);

const LatestTransfersSection = () => {
  const [lastTransfers] = useState(true);

  return (
    <div className="box transfers-section">
      <h2 className="transfers-section-title">Latest transfers</h2>
      {lastTransfers ? <Table rows={dataPlaceholder} /> : <p className="transfers-section-text">You have no history of transfers.</p>}
    </div>
  );
};

const dataPlaceholder = [
  {
    id: 1,
    icon: ethIcon,
    currency: 'ethereum',
    shortcut: 'eth',
    address: 'bob.universal.eth',
    amountUsd: 2.5,
    amountEth: 0.0034729103,
    date: '05/02/2019',
    status: 'completed',
  },
  {
    id: 2,
    icon: mkrIcon,
    currency: 'maker',
    shortcut: 'mkr',
    address: 'alex.universal.eth',
    amountUsd: 1,
    amountEth: 0.0034729103,
    date: '04/02/2019',
    status: 'pending',
  },
  {
    id: 3,
    icon: ethIcon,
    currency: 'ethereum',
    shortcut: 'eth',
    address: 'bob.universal.eth',
    amountUsd: 2.5,
    amountEth: 0.0034729103,
    date: '05/02/2019',
    status: 'completed',
  },
  {
    id: 4,
    icon: mkrIcon,
    currency: 'maker',
    shortcut: 'mkr',
    address: 'alex.universal.eth',
    amountUsd: 1,
    amountEth: 0.0034729103,
    date: '04/02/2019',
    status: 'pending',
  },
];

export default LatestTransfersSection;