export const confirmationEmailHtml = (code: string) => `
<html>
  <head>
    <style>
      .confirmationCode {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 15px;
      }
      .email {
        position: relative;
        width: 600px;
        height: 1021px;
        background: #fff
      }
      a {
        background-color: #0E1F98;
        box-shadow: 0 5px 0 darkred;
        padding: 1em 1.5em;
        position: relative;
        text-decoration: none;
        text-transform: uppercase;
        border-radius: 3px;
      }

      a:hover {
        cursor: pointer;
      }

      a:active {
        box-shadow: none;
        top: 5px;
      }
    </style>
  </head>
  <body>
    <div class='email'>
    <h1>Email Confirmation</h1><br>
    <div class='confirmationCode'>
      To make sure your UniLogin account is safe and secure, we ask you to authenticate your email address by copying the code below and pasting it in UniLogin.

      <br>Your code: ${code}<br><br>
      <a href='https://universal-provider-backend.netlify.com/copyToClipboard?code=${code}' color='#ffffff'>Copy</a>
    </div><br>
    </div>
  </body>
</html>
`;
