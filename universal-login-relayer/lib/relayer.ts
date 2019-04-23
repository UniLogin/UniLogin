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
import {Config} from '@universal-login/commons';
import TransactionService from './services/TransactionService';
import TransactionQueueService from './services/TransactionQueueService';
import TransactionQueueStore from './services/TransactionQueueStore';

const defaultPort = '3311';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500)
    .type('json')
    .send(JSON.stringify({error: err.toString()}));
}


class Relayer {
  protected readonly port: string;
  private readonly hooks: EventEmitter;
  public provider: providers.Provider;
  private readonly wallet: Wallet;
  public readonly database: Knex;
  private ensService: ENSService = {} as ENSService;
  private authorisationService: AuthorisationService = {} as AuthorisationService;
  private walletContractService: WalletService = {} as WalletService;
  private transactionQueueStore: TransactionQueueStore = {} as TransactionQueueStore;
  private transactionQueueService: TransactionQueueService = {} as TransactionQueueService;
  private transactionService: TransactionService = {} as TransactionService;
  private app: Application = {} as Application;
  protected server: Server = {} as Server;

  constructor(protected config: Config, provider?: providers.Provider) {
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
    this.transactionQueueService.start();
  }

  runServer() {
    this.app = express();
    this.app.use(useragent.express());
    this.app.use(cors({
      origin : '*',
      credentials: true,
    }));
    this.ensService = new ENSService(this.config.chainSpec.ensAddress!, this.config.ensRegistrars, this.provider);
    this.authorisationService = new AuthorisationService(this.database);
    this.walletContractService = new WalletService(this.wallet, this.config.walletMasterAddress!, this.ensService, this.hooks, this.config.legacyENS);
    this.transactionQueueStore = new TransactionQueueStore(this.database);
    this.transactionQueueService = new TransactionQueueService(this.wallet, this.provider, this.transactionQueueStore);
    this.transactionService = new TransactionService(this.wallet, this.authorisationService, this.hooks, this.provider, this.transactionQueueService);
    this.app.use(bodyParser.json());
    this.app.use('/wallet', WalletRouter(this.walletContractService, this.transactionService));
    this.app.use('/config', ConfigRouter(this.config.chainSpec));
    this.app.use('/authorisation', RequestAuthorisationRouter(this.authorisationService));
    this.app.use(errorHandler);
    this.server = this.app.listen(this.port);
  }

  async stop() {
    await this.transactionQueueService.stop();
    await this.database.destroy();
    await this.server.close();
  }
}

export default Relayer;
