import express from 'express';
import IdentityRouter from './routes/identity';
import ConfigRouter from './routes/config';
import RequestAuthorisationRouter from './routes/authorisation';
import IdentityService from './services/IdentityService';
import ENSService from './services/ensService';
import bodyParser from 'body-parser';
import ethers from 'ethers';
import cors from 'cors';
import AuthorisationService from './services/authorisationService';

const defaultPort = 3311;

class Relayer {
  constructor(provider, config) {
    this.wallet = new ethers.Wallet(config.privateKey, provider);
    this.port = config.port || defaultPort;
    this.config = config;
  }

  start() {
    this.app = express();
    this.app.use(cors({
      origin : '*',
      credentials: true
    }));
    this.ensService = new ENSService(this.config.chainSpec.ensAddress, this.config.ensRegistrars);
    this.authorisationService = new AuthorisationService();
    this.identityService = new IdentityService(this.wallet, this.ensService, this.authorisationService);
    this.app.use(bodyParser.json());
    this.app.use('/identity', IdentityRouter(this.identityService));
    this.app.use('/config', ConfigRouter(this.config.chainSpec));
    this.app.use('/authorisation', RequestAuthorisationRouter(this.authorisationService));
    this.server = this.app.listen(this.port);
  }

  async stop() {
    this.server.close();
  }
}

export default Relayer;
