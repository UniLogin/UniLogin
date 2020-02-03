import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  & > * {
    width: 100%;
  }

  @media(max-width: 600px) {
    display: block;
    margin-bottom: 24px;
  }
`;
