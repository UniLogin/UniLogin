import styled from 'styled-components';
import {ButtonPrimary} from '../Button/Button';

export const BoxFooter = styled.div`
  padding: 0 30px 24px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: auto;
  flex-grow: 1;

  & ${ButtonPrimary} {
    margin-left: 8px;
  }

  @media(max-width: 600px) {
    justify-content: space-between;
    margin-top: 67px;
    padding: 0;
  }
`;
