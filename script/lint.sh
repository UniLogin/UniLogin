#!/bin/bash
cd universal-login-relayer &&
yarn lint &&
cd ../universal-login-sdk &&
yarn lint &&
cd ../universal-login-example &&
yarn lint