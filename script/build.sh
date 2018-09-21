#!/bin/bash
# Run from main dir
yarn
cd universal-login-relayer &&
yarn contracts:build &&
yarn build &&
cd ../universal-login-sdk &&
yarn build &&
cd ../universal-login-example &&
yarn contracts:build &&
yarn build &&
cd ..