#!/bin/bash
rm -fr node_modules
cd universal-login-contracts &&
yarn clean &&
cd ../universal-login-relayer &&
yarn clean &&
cd ../universal-login-sdk &&
yarn clean &&
cd ../universal-login-example &&
yarn clean 
