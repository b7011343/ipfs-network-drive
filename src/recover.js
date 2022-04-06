#!/usr/bin/env node
const IPFS = require('ipfs-core');
const fs = require('fs');
const compressing = require('compressing');
const CryptoJS = require("crypto-js");

const args = {
  CONTENT_HASH: 'h',
  DESTINATION_DIRECTORY: 'd'
};
  
const argv = require('minimist')(process.argv.slice(2));
  
Object.keys(args).forEach((arg) => {
  if (!argv.hasOwnProperty(args[arg])) {
    throw new Error(`Missing argument -${args[arg]} ${arg}`);
  }
});
