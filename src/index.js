#!/usr/bin/env node
const forever = require('forever-monitor');

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

const ftpBackupServer = new (forever.Monitor)('./src/server.js', {
  silent: false,
  killTree: true,
  killSignal: 'SIGINT',
  args: [argv.u, argv.p]
});

ftpBackupServer.on('watch:restart', (info) => {
  console.error('Restarting IPFS auto sync script because ' + info.file + ' changed');
});

ftpBackupServer.on('restart', () => {
  console.error('Forever restarting IPFS auto sync script for ' + ftpBackupServer.times + ' time');
});

ftpBackupServer.on('exit:code', (code) => {
  console.error('Forever detected IPFS auto sync script exited with code ' + code);
});

ftpBackupServer.start();
