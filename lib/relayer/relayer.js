import express from 'express';
import IdentityRouter from './routes/identity';
import IdentityService from './services/identity';

const defaultConfig = {
  port: 3311
};

class Relayer {
  constructor(config) {
    this.config = {...defaultConfig, ...config};
  }

  async start() {
    this.app = express();
    this.identityService = new IdentityService();
    this.app.use('/identity', IdentityRouter(this.identityService));
    this.server = this.app.listen(this.config.port);
  }

  async stop() {
    this.server.close();
  }
}

export default Relayer;
