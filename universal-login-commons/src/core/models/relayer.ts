import {LocalizationConfig, SafelloConfig, RampConfig, WyreConfig} from './onRamp';

export interface SupportedToken {
  address: string;
  minimalAmount?: string;
}

export interface ContractWhiteList {
  wallet: string[];
  proxy: string[];
}

export interface OnRampConfig {
  safello: SafelloConfig;
  ramp: RampConfig;
  wyre: WyreConfig;
}

export interface IPGeolocationApiConfig {
  baseUrl: string;
  accessKey: string;
}

export interface PublicRelayerConfig {
  ensRegistrar: string;
  supportedTokens: SupportedToken[];
  factoryAddress: string;
  fallbackHandlerAddress: string;
  walletContractAddress: string;
  ensAddress: string;
  network: string;
  contractWhiteList: ContractWhiteList;
  localization: LocalizationConfig;
  onRampProviders: OnRampConfig;
  maxGasLimit: number;
  ipGeolocationApi: IPGeolocationApiConfig;
  relayerAddress: string;
}
