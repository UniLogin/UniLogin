export interface LocalizationConfig {
  language: string;
  country: string;
}

export interface SafelloConfig {
  appId: string;
  baseAddress: string;
  addressHelper: boolean;
}

export interface RampConfig {
  appName: string;
  logoUrl: string;
  rampUrl: string;
  rampApiKey?: string;
}

export type RampOverrides = Partial<Pick<RampConfig, 'rampApiKey' | 'logoUrl'>>;

export interface WyreConfig {
  wyreUrl: string;
}
