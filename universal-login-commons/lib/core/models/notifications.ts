export interface Notification {
  id: number;
  key: string;
  walletContractAddress: string;
  deviceInfo: DeviceInfo;
}

export interface DeviceInfo {
  ipAddress: string;
  name: string;
  city: string;
  os: string;
  browser: string;
  time: string;
}
