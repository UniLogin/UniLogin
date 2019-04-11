import {utils} from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

interface ChainSpec extends utils.Network {
  publicResolverAddress?: string;
}

export interface Config {
  legacyENS: boolean;
  jsonRpcUrl?: string;
  port?: string;
  privateKey: string;
  chainSpec: ChainSpec;
  ensRegistrars: string[];
  walletMasterAddress?: string;
}