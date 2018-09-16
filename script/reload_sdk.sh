#!/bin/bash
cd sdk
yarn dist:build
cd ../example
yarn remove ethereum-identity-sdk
yarn add file:./../sdk