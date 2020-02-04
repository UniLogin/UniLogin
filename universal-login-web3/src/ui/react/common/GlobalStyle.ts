import {createGlobalStyle} from 'styled-components';

export const GlobalStyle = createGlobalStyle`
.universal-login-default .modal-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 770px;
  width: 100%;
  min-height: initial;
  max-height: 100%;
  overflow-y: auto;
}
.universal-login-default .modal {
  background: #ffffff;
  overflow: visible;
}
`;
