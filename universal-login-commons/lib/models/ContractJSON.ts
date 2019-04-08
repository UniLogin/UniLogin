export interface AbiEntry {
  name?: string;
  type: string;
}

export type Abi = AbiEntry[];

export interface Bytecode {
  linkReferences: Record<string, any>;
  object: string;
  opcodes: string;
  sourceMap: string;
}

export interface ContractJSON {
  abi: Abi;
  interface: Abi;
  evm: {
    bytecode: Bytecode;
    deployedBytecode: Bytecode;
  };
}
