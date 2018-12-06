#!/bin/bash
cd universal-login-contracts &&
yarn lint &&
cd ../universal-login-relayer &&
yarn lint &&
cd ../universal-login-sdk &&
yarn lint &&
cd ../universal-login-example &&
yarn lint 
