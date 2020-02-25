import React from 'react';
import styled from 'styled-components';
import {GasMode} from '@unilogin/commons';
import moment from 'moment';

export interface TransactionSpeedSelectionProps {
  selectedValue: string;
  onChange: (value: string) => void;
}

export interface TransactionSpeedProps extends TransactionSpeedSelectionProps {
  gasModes: GasMode[];
}

export const TransactionSpeed = ({gasModes, selectedValue, onChange}: TransactionSpeedProps) => {
  return (
    <Row>
      {gasModes.map(({name, timeEstimation}) => (
        <RadioButton
          key={name}
          value={name}
          selectedValue={selectedValue}
          onChange={onChange}
          time={moment.duration(timeEstimation, 'seconds').humanize()}
        />
      ))}
    </Row>
  );
};

interface RadioButtonProps extends TransactionSpeedSelectionProps {
  value: string;
  time: string;
}

const RadioButton = ({value, onChange, selectedValue, time}: RadioButtonProps) => (
  <RadioLabel>
    <Radio
      type="radio"
      name="speed"
      checked={value === selectedValue}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
    <RadioCustom>
      <RadioTitle>{value}</RadioTitle>
      <RadioTime>{time}</RadioTime>
    </RadioCustom>
  </RadioLabel>
);

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100;
`;

const RadioCustom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 8px 0;
  background: #FFFFFF;
  border: 1px solid rgba(190, 207, 217, 0.6);
  box-sizing: border-box;
  border-radius: 4px;
`;

const RadioTitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 17px;
  color: #7D7C9C;
  text-align: center;
  text-transform: capitalize;
`;

const RadioTime = styled.p`
  margin: 0;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  color: #7D7C9C;
`;

const Radio = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;

  &:checked ~ ${RadioCustom} {
    border: 1px solid rgba(8, 174, 197, 0.5);
    box-shadow: 0px 10px 40px rgba(0, 131, 188, 0.12);
  }
  &:checked ~ ${RadioCustom} ${RadioTitle} {
    font-weight: 500;
    color: #0F0C4A;
  }
  &:checked ~ ${RadioCustom} ${RadioTime} {
    color: #0F0C4A;
  }
`;

const RadioLabel = styled.label`
  max-width: 104px;
  width: 100%;
  background: #FFFFFF;
  box-sizing: border-box;
  cursor: pointer;

  & + & {
    margin-left: 8px;

    @media(max-width: 600px) {
      margin-left: 30px;
    }
  }

  @media(max-width: 600px) {
    max-width: 129px;
  }
`;
