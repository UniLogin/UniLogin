import express from 'express';
import {confirmationEmailHtml} from './core/utils/confirmationEmailHtml';
import {UNILOGIN_LOGO_WITH_NAME_URL} from '@unilogin/commons';

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send(confirmationEmailHtml({code: 'uni-login-291862', clipboardUrl: 'http://localhost:8080/copy', logoUrl: UNILOGIN_LOGO_WITH_NAME_URL}));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
