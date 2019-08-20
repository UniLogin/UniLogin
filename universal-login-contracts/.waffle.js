module.exports = {
  npmPath: "../node_modules",
  compiler: process.env.WAFFLE_COMPILER,
  solcVersion: 'v0.5.10+commit.5a6ea5b1',
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
