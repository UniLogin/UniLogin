import express from 'express';
import IdentityRouter from './routes/identity';
import IdentityService from './services/IdentityService';
import bodyParser from 'body-parser';
import ethers from 'ethers';

class Relayer {
  constructor(provider, privateKey, port = 3311) {
    this.wallet = new ethers.Wallet(privateKey, provider);
    this.port = port;
  }

  start() {
    this.app = express();
    this.identityService = new IdentityService(this.wallet);
    this.app.use(bodyParser.json());
    this.app.use('/identity', IdentityRouter(this.identityService));
    this.server = this.app.listen(this.port);
  }

  async stop() {
    this.server.close();
  }
}

export default Relayer;
