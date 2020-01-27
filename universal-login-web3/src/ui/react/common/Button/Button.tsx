import styled from 'styled-components';

const BaseButton = styled.button`
  display: block;
  max-height: 40px;
  padding: 11.5px 24px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
`;

export const ButtonPrimary = styled(BaseButton)`
  background: linear-gradient(147.41deg, #00BFD9 0.28%, #527EEE 100%);
  color: #FFFFFF;
`;

export const ButtonSecondary = styled(BaseButton)`
  background: #fff;
  border: 1px solid rgba(25, 57, 181, 0.2);
  color: #0F0C4A;
`;
