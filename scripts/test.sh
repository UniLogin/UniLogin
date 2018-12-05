#!/bin/bash
cd universal-login-contracts &&
yarn test &&
cd ../universal-login-relayer &&
yarn test &&
cd ../universal-login-sdk &&
yarn test &&
cd ../universal-login-example &&
yarn test
