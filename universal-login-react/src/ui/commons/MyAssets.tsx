import React from 'react';
import ethereumIcon from './../assets/myAssets/ether.svg';
import {TokenDetailsWithBalance} from '@universal-login/commons';
import './../styles/my-assets.css';

export interface MyAssetsProps {
  title?: string;
  assetsList: TokenDetailsWithBalance[];
}

export const MyAssets = ({title, assetsList}: MyAssetsProps) => (
  <div className="my-assets">
    <p className="my-assets-title">{title}</p>
    <ul className="my-assets-list">
      {assetsList.map((asset, index) => (
        <li key={`${asset.name}_${index}`} className="my-assets-item">
          <div className="my-assets-item-left">
            <div className="my-assets-img-wrapper">
              <img src={ethereumIcon} alt={asset.name} className="my-assets-img" />
            </div>
            <div>
              <p className="my-assets-name">{asset.name}</p>
              <p className="my-assets-price">$192,21</p>
            </div>
          </div>
          <div className="my-assets-item-right">
            <p className="my-assets-balance">0 ETH</p>
            <p className="my-assets-price">$0</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
);
