import React from 'react';
import warningIcon from '../../assets/warning.svg';
import styled from 'styled-components';

export interface NoticeProps {
  message: string;
}

export const Notice = ({message}: NoticeProps) => {
  if (message) {
    return (
      <NoticeWrapper>
        <NoticeText>{message}</NoticeText>
      </NoticeWrapper>
    );
  };

  return null;
};

const NoticeWrapper = styled.div`
  position: absolute;
  bottom: -24px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 100%;
  padding-top: 6px;
  background: rgba(15, 12, 74, 0.5);
  text-align: center;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  z-index: -1;
`;

const NoticeText = styled.p`
  position: relative;
  margin: 0;
  padding-left: 18px;
  display: inline;
  font-size: 12px;
  line-height: 14px;
  color: #FFFFFF;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 13px;
    height: 11px;
    transform: translateY(-50%);
    background: url(${warningIcon}) center no-repeat;
    background-size: contain;
  };
`;
