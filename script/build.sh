#!/bin/bash
# Run from main dir
cd relayer &&
yarn &&
yarn contracts:build &&
yarn dist:build &&
cd ../sdk &&
yarn &&
yarn dist:build &&
cd ../example &&
yarn &&
yarn contracts:build &&
yarn build &&
cd ..