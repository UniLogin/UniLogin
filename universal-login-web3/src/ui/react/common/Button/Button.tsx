import styled from 'styled-components';

const BaseButton = styled.button`
  display: block;
  padding: 1.15rem 2.4rem;
  border-radius: .4rem;
  padding: 1.15rem 0;
  font-size: 1.4rem;
  font-weight: 700;
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
