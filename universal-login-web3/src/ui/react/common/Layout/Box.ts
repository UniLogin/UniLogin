import styled from 'styled-components';

export const Box = styled.div`
  position: relative;
  max-width: 770px;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  padding: 8px;

  @media(max-width: 600px) {
    min-height: calc(100vh - 41px);
    display: flex;
    flex-direction: column;
    padding: 16px 16px 16px;
    border-radius: 0;
  }
`;
