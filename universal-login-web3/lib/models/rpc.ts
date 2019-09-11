export interface JsonRPCRequest {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number;
}

export interface JsonRPCResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: string;
}

export interface Callback<ResultType> {
  (error: Error): void;

  (error: null, val: ResultType): void;
}
