# UniLogin provider

## Installation

Using npm:

```
npm install --save @unilogin/provider
```

Using yarn:

```
yarn add @unilogin/provider
```

From a CDN using unpkg.com:

```html
<html>
  <body>
    <!-- Load the script inside the BODY tag -->
    <script src="https://unpkg.com/@unilogin/provider"></script>
  </body>
</html>
```

## Getting started

For npm/yarn users:

```javascript
import ULIFrameProvider from '@unilogin/provider'

web3.setProvider(ULIFrameProvider.createPicker(web3.currentProvider))

```

Or if you are using ethers:

```javascript
import ULIFrameProvider from '@unilogin/provider'

const provider = new providers.Web3Provider(ULIFrameProvider.createPicker(window.ethereum))
```

If you are developing a website without bundler (pure HTML / JavaScript):

```html
<html>
  <head>
    <script src="https://unpkg.com/web3@latest/dist/web3.min.js"></script>
  </head>
  <body>
    <button id="unilogin-button"></button>
    <script src="https://unpkg.com/@unilogin/provider"></script>
    <script>
      window.web3 = new Web3(ULIFrameProvider.createPicker(window.ethereum))
    </script>
  </body>
</html>
```
