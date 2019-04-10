import {Network} from 'ethers/utils';
import dotenv from 'dotenv';
dotenv.config();

interface ChainSpec extends Network {
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