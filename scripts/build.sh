#!/bin/bash
# Run from main dir
yarn
cd universal-login-contracts &&
yarn build &&
cd ../universal-login-relayer &&
yarn build &&
cd ../universal-login-sdk &&
yarn build &&
cd ../universal-login-example &&
yarn build &&
cd ..
