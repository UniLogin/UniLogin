export interface CancelAuthorisationRequest {
  walletContractAddress: string;
  publicKey: string;
  signature?: string;
}

export interface GetAuthorisationRequest {
  walletContractAddress: string;
  signature?: string;
}
