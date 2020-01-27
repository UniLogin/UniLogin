import React from 'react';
import LinkIcon from '../../assets/icons/link.svg';
import './../../styles/buttonLink.sass';

interface ButtonProps {
  // id: string;
  text: string;
  onClick: () => void;
}

export const ButtonLink = ({text, onClick}: ButtonProps) => (
  <button id={'btn-link'} onClick={onClick} className="btn-link">
    <h3 className="btn-link-text">{text}</h3>
    <img src={LinkIcon} alt="Ethereum logo" className="btn-link-img"/>
  </button>
);
