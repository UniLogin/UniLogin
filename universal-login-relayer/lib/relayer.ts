import express, {Request, Response, NextFunction, Application} from 'express';
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
import Knex from 'knex';
import {Server} from 'http';

const defaultPort = 3311;

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500)
    .type('json')
    .send(JSON.stringify({error: err.toString()}));
}

interface RelayerConfig {
  legacyENS: boolean;
  jsonRpcUrl: string;
  port: string;
  privateKey: string;
  chainSpec: {
    ensAddress: string;
    chainId: number;
    name: string;
  };
  ensRegistrars: string[];
  walletMasterAddress: string;
}

class Relayer {
  private readonly port: number | string;
  private readonly hooks: EventEmitter;
  private readonly provider: providers.Provider;
  private readonly wallet: Wallet;
  private readonly database: Knex;
  private ensService: ENSService = {} as ENSService;
  private authorisationService: AuthorisationService = {} as AuthorisationService;
  private walletContractService: WalletService = {} as WalletService;
  private app: Application = {} as Application;
  private server: Server = {} as Server;

  constructor(private config: RelayerConfig, provider?: providers.Provider) {
    this.port = config.port || defaultPort;
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
    this.walletContractService = new WalletService(this.wallet, this.config.walletMasterAddress, this.ensService, this.authorisationService, this.hooks, this.provider, this.config.legacyENS);
    this.app.use(bodyParser.json());
    this.app.use('/wallet', WalletRouter(this.walletContractService));
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
