#!/bin/bash
cd universal-login-sdk
yarn dist:build
cd ../universal-login-example
yarn remove universal-login-sdk
yarn add universal-login-sdk