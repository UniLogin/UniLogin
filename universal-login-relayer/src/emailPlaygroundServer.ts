import express from 'express';
import {confirmationEmailHtml} from './core/utils/confirmationEmailHtml';

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  res.send(confirmationEmailHtml({code: 'uni-login-291862', clipboardUrl: '/somelink'}));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
