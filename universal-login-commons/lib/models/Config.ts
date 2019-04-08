import {Network} from 'ethers/utils';
import dotenv from 'dotenv';
dotenv.config();

export default interface Config {
  legacyENS? : boolean;
  jsonRpcUrl? : string;
  port? : string;
  privateKey? : string;
  chainSpec : Network;
  ensRegistrars? : string[];
}