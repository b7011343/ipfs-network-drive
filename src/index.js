#!/usr/bin/env node
const { startServer } = require('./server');

const args = {
  USERNAME: 'u',
  PASSWORD: 'p'
};

const argv = require('minimist')(process.argv.slice(2));

Object.keys(args).forEach((arg) => {
  if (!argv.hasOwnProperty(args[arg])) {
    throw new Error(`Missing argument -${args[arg]} ${arg}`);
  }
});

startServer(argv.u, argv.p);
