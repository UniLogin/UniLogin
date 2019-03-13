import express from 'express';
import WalletRouter from './routes/wallet';
import ConfigRouter from './routes/config';
import RequestAuthorisationRouter from './routes/authorisation';
import WalletService from './services/WalletService';
import ENSService from './services/ensService';
import bodyParser from 'body-parser';
import {Wallet, providers} from 'ethers';
import cors from 'cors';
import AuthorisationService from './services/authorisationService';
import {EventEmitter} from 'fbemitter';
import useragent from 'express-useragent';
import {getKnex} from './utils/knexUtils';

const defaultPort = 3311;

function errorHandler(err, req, res, next) {
  res.status(500)
    .type('json')
    .send(JSON.stringify({error: err.toString()}));
}

class Relayer {
  constructor(config, provider = '') {
    this.port = config.port || defaultPort;
    this.config = config;
    this.hooks = new EventEmitter();
    this.provider = provider || new providers.JsonRpcProvider(config.jsonRpcUrl, config.chainSpec);
    this.wallet = new Wallet(config.privateKey, this.provider);
    this.database = getKnex();
  }

  async start() {
    await this.database.migrate.latest();
    this.runServer();
    await this.ensService.start();
  }

  runServer() {
    this.app = express();
    this.app.use(useragent.express());
    this.app.use(cors({
      origin : '*',
      credentials: true,
    }));
    this.ensService = new ENSService(this.config.chainSpec.ensAddress, this.config.ensRegistrars, this.provider);
    this.authorisationService = new AuthorisationService(this.database);
    this.identityService = new WalletService(this.wallet, this.ensService, this.authorisationService, this.hooks, this.provider, this.config.legacyENS);
    this.app.use(bodyParser.json());
    this.app.use('/wallet', WalletRouter(this.identityService));
    this.app.use('/config', ConfigRouter(this.config.chainSpec));
    this.app.use('/authorisation', RequestAuthorisationRouter(this.authorisationService));
    this.app.use(errorHandler);
    this.server = this.app.listen(this.port);
  }

  async stop() {
    await this.database.destroy();
    await this.server.close();
  }
}

export default Relayer;
