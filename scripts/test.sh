#!/bin/bash
echo Testing contracts... &&
cd universal-login-contracts &&
yarn test &&
echo Testing relayer... &&
cd ../universal-login-relayer &&
yarn test &&
echo Testing sdk... &&
cd ../universal-login-sdk &&
yarn test &&
echo Testing example... &&
cd ../universal-login-example &&
yarn test
