import styled from 'styled-components';

export const CloseButton = styled.button`
  position: relative;
  display: block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(67, 157, 176, 0.4);
  background: none;
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 1px;
    height: 11px;
    background-color: #7D7C9C;
  }
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(135deg);
    width: 1px;
    height: 11px;
    background-color: #7D7C9C;
  }

  @media only screen and (max-width: 600px) {
    transform: scale(1.4);
  }

  @media only screen and (max-width: 350px) {
    transform: scale(1);
  }
`;
