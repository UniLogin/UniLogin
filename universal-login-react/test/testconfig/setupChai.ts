import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';
import {solidity} from 'ethereum-waffle';

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(solidity);
