import express, {Application} from 'express';
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
import {Config} from './config/relayer';
import MessageHandler from './services/MessageHandler';
import MessageQueueStore from './services/messages/MessageQueueStore';
import errorHandler from './middlewares/errorHandler';
import PendingMessagesSQLStore from './services/messages/PendingMessagesSQLStore';

const defaultPort = '3311';


export type RelayerClass = {
  new (config: any, provider: providers.Provider): Relayer;
};

class Relayer {
  protected readonly port: string;
  protected readonly hooks: EventEmitter;
  public provider: providers.Provider;
  protected readonly wallet: Wallet;
  public readonly database: Knex;
  private ensService: ENSService = {} as ENSService;
  private authorisationService: AuthorisationService = {} as AuthorisationService;
  private walletContractService: WalletService = {} as WalletService;
  private messageQueueStore: MessageQueueStore = {} as MessageQueueStore;
  private messageHandler: MessageHandler = {} as MessageHandler;
  private pendingMessagesStore: PendingMessagesSQLStore = {} as PendingMessagesSQLStore;
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
    this.messageHandler.start();
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
    this.walletContractService = new WalletService(this.wallet, this.config.walletMasterAddress, this.ensService, this.hooks);
    this.pendingMessagesStore = new PendingMessagesSQLStore(this.database);
    this.messageQueueStore = new MessageQueueStore(this.database);
    this.messageHandler = new MessageHandler(this.wallet, this.authorisationService, this.hooks, this.pendingMessagesStore, this.messageQueueStore, this.config.contractWhiteList);
    const {chainSpec, supportedTokens, factoryAddress} = this.config;
    const config = {
      chainSpec,
      supportedTokens,
      factoryAddress
    };
    this.app.use(bodyParser.json());
    this.app.use('/wallet', WalletRouter(this.walletContractService, this.messageHandler));
    this.app.use('/config', ConfigRouter(config));
    this.app.use('/authorisation', RequestAuthorisationRouter(this.authorisationService));
    this.app.use(errorHandler);
    this.server = this.app.listen(this.port);
  }

  async stop() {
    await this.messageHandler.stop();
    await this.database.destroy();
    await this.server.close();
  }

  async stopLater() {
    await this.messageHandler.stopLater();
    await this.database.destroy();
    await this.server.close();
  }
}

export default Relayer;
