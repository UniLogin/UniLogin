import styled from 'styled-components';

export const Box = styled.div`
  position: relative;
  max-width: 770px;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex: 1;

  @media(max-width: 600px) {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 16px 16px 16px;
    border-radius: 0;
  }
`;
