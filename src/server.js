const { FtpSrv, FileSystem } = require('ftp-srv');
const fs = require('fs');
const { Netmask } = require('netmask');
const { networkInterfaces } = require('os');
const bunyan = require('bunyan');

const nets = networkInterfaces();
const logger = bunyan.createLogger({ name: 'ftp-ipfs' });
const [username, password] = process.argv.slice(2);

const getNetworks = () => {
  let networks = {};
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        networks[net.address + "/24"] = net.address
      }
    }
  }
  return networks;
};

const resolverFunction = (ip) => {
  const networks = getNetworks();
  for (const network in networks) {
    if (new Netmask(network).contains(ip)) {
      return networks[network];
    }
  }
  return "127.0.0.1";
};

const server = new FtpSrv({
  pasv_url: resolverFunction,
  url: 'ftp://0.0.0.0:21',
  log: logger,
  anonymous: false,
  file_format: 'ep'
});

server.on('login', (data, resolve, reject) => {
  if(data.username === username && data.password === password) {
    console.log('Authentication successful');
    return resolve({ root: './ftp-drive/' });
  }
  return reject(new errors.GeneralError('Invalid username or password', 401));
});

server.on('client-error', ({connection, context, error}) => {
  console.error(`FTP server error: error interfacing with client ${context} ${error}`); 
});

// File downloaded
server.on('RETR', (error, filePath) => {
  console.log('DOWNLOAD');
});

// File uploaded
server.on('STOR', (error, fileName) => {
  console.log('UPLOAD');
});

// File name changed
server.on('RNTO', (error, fileName) => {
  console.log('RENAME');
});

server.listen().then(() => console.log('FTP server started'));

// const PID = server?.log?.fields?.pid;

// // const exitHandler = async (options, exitCode) => {
// //   await server.close();
// //   PID && process.kill(PID) && console.log(`${PID} terminated`);
// //   if (options.cleanup) console.log('clean');
// //   if (exitCode || exitCode === 0) console.log(exitCode);
// //   if (options.exit) process.exit();
// // };

// const exit = () => {
//   console.log(PID);
//   process.kill(PID) && console.log(`${PID} terminated`);
//   server.close();
// };

// process.on('exit', () => exit());
// process.on('SIGINT', () => exit());
// process.on('uncaughtException', () => exit());


// // process.on('exit', exitHandler.bind(null, { cleanup: true }));
// // process.on('SIGINT', exitHandler.bind(null, { exit: true }));
// // process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
