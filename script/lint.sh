#!/bin/bash
cd relayer &&
yarn lint &&
cd ../sdk &&
yarn lint &&
cd ../example &&
yarn lint