#!/bin/bash
# Run from main dir
cd sdk &&
yarn &&
yarn build &&
yarn test &&
yarn lint &&
cd ../example &&
yarn &&
yarn lint