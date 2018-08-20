import ethers from 'ethers';
import Relayer from '../lib/relayer/relayer';
import {jsonRpcUrl, privateKey} from '../config/relayer';

const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl);
const relayer = new Relayer(provider, privateKey);
relayer.start();
