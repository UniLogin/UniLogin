import React from 'react';

interface ButtonProps {
  id: string;
  image: string;
  title: string;
  text: string;
  onClick: () => void;
}

export const Button = ({ id, image, title, text, onClick }: ButtonProps) => (
  <button id={`topup-btn-${id}`} onClick={onClick} className="topup-btn">
    <img src={image} alt="Ethereum logo" className="topup-btn-img"/>
    <div>
      <h3 className="topup-btn-title">{title}</h3>
      <p className="topup-btn-text">{text}</p>
    </div>
  </button>
);
