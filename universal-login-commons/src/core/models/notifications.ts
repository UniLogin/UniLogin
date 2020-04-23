export interface Notification {
  id: number;
  key: string;
  walletContractAddress: string;
  securityCodeWithFakes?: number[];
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo extends ApplicationInfo {
  ipAddress: string;
  platform: string;
  city: string;
  os: string;
  browser: string;
  time: string;
}

export interface ApplicationInfo {
  applicationName: string;
  type: DeviceType;
  logo: string;
}

export type DeviceType = 'laptop' | 'phone' | 'tablet' | 'unknown';

export interface Device {
  contractAddress: string;
  publicKey: string;
  deviceInfo: DeviceInfo;
}
