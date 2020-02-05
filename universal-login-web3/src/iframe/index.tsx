import {JsonRPCResponse} from '../models/rpc';
import {ULWeb3Provider} from '../ULWeb3Provider';

const universalLogin = ULWeb3Provider.getDefaultProvider('kovan');
universalLogin.init()
window.addEventListener('message', e => {
  if(e.data.type !== 'ulRPC') {
    return
  }
  const rpc = e.data.payload
  console.log('iframe>', rpc)
  universalLogin.send(rpc, (error: any, response?: JsonRPCResponse) => {
    if(error) {
      console.error('web3 error in iframe', error)
    } else {
      console.log('<iframe', response)
      window.top.postMessage({ type: 'ulRPC', payload: response }, '*')
    }
  })
})
