module.exports = {
  npmPath: "../node_modules",
  compiler: process.env.WAFFLE_COMPILER,
  legacyOutput: true,
  outputType: 'all',
  compilerOptions: {
    evmVersion: "constantinople",
    outputSelection: {
      "*": {
        "*": [ "evm.bytecode.object", "evm.deployedBytecode.object",
               "abi" ,
               "evm.bytecode.sourceMap", "evm.deployedBytecode.sourceMap" ],
        
        "": [ "ast" ]
      },     
    }
  }
};
