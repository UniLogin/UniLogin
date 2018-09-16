#!/bin/bash
cd relayer &&
yarn test &&
cd ../sdk &&
yarn test