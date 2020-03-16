var script = document.createElement('script');
script.src = 'https://unpkg.com/@unilogin/provider';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);



window.Web3();
var provider = ULIFrameProvider.create('rinkeby');
window.ethereum = provider;
window.web3.setProvider(provider);

const logged = (fn, fnName) => (...args) => {
  console.log(fnName, ...args);
  return fn(...args);
};
window.ethereum.send =logged(window.ethereum.send.bind(this), 'ethereum.send')
window.ethereum.sendAsync = logged(window.ethereum.sendAsync.bind(this), 'ethereum.sendAsync')
window.ethereum.enable = logged(window.ethereum.enable.bind(this), 'ethereum.enable')
