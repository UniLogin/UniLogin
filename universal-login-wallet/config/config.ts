require('dotenv').config();
import {ETHER} from 'universal-login-commons';

module.exports = Object.freeze({
  development: {
    domains: ["mylogin.eth"],
    relayerUrl: "http://localhost:3311",
    jsonRpcUrl: "http://localhost:18545",
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS, ETHER.address]
  },

  test: {
    domains: ["mylogin.eth"],
    relayerUrl: "http://localhost:33111",
    jsonRpcUrl: "http://localhost:8545",
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS, ETHER.address]
  },
  
  production: {
    domains: ["my-id.test"],
    relayerUrl: "https://relayer.universallogin.io",
    jsonRpcUrl: "https://rinkeby.infura.io",
    tokens: [process.env.TOKEN_CONTRACT_ADDRESS, ETHER.address]
  }
})
