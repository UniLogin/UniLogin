export interface RefundPayer {
  name: string;
  apiKey: string;
}

export interface RefundPayerEntity extends RefundPayer {
  id: string;
}
