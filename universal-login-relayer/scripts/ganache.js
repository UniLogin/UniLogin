import Ganache from 'ganache-core';
import {port, options} from '../test/config/ganache';

const server = Ganache.server(options);
server.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`Ganache up and running on port ${port}...`);
  }
});
