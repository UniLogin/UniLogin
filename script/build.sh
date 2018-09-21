#!/bin/bash
# Run from main dir
yarn
cd universal-login-relayer &&
yarn contracts:build &&
yarn dist:build &&
cd ../universal-login-sdk &&
yarn dist:build &&
cd ../universal-login-example &&
yarn contracts:build &&
yarn build &&
cd ..