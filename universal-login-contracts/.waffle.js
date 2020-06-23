module.exports = {
  outputDirectory: './dist/contracts',
  nodeModulesDirectory: '../node_modules',
  compilerType: 'solcjs',
  compilerVersion: 'v0.5.10+commit.5a6ea5b1',
  outputType: 'all',
  compilerOptions: {
    evmVersion: 'constantinople',
    outputSelection: {
      "*": {
        "*": [ 'evm.bytecode.object', 'evm.deployedBytecode.object',
               'abi' ,
               'evm.bytecode.sourceMap', 'evm.deployedBytecode.sourceMap' ],
        "": [ 'ast' ]
      }
    }
  }
};
