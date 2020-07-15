import express from 'express';
import {confirmationEmail} from './core/utils/confirmationEmailHtml';
import {render} from 'mjml-react';

const port = 3000;
const app = express();

app.get('/', (req, res) => {
  const confirmation = render(confirmationEmail('uni-login-291862'), {validationLevel: 'soft'}).html;
  res.send(confirmation);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
