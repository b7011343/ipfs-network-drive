const { FtpSrv, FileSystem } = require('ftp-srv');
const { Netmask } = require('netmask');
const { networkInterfaces } = require('os');
const bunyan = require('bunyan');
const path = require('path');

const nets = networkInterfaces();
const logger = bunyan.createLogger({ name: 'ftp-ipfs' });

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

const startServer = (_username, _password) => {
  const server = new FtpSrv({
    pasv_url: resolverFunction,
    url: 'ftp://0.0.0.0:21',
    log: logger,
    anonymous: false,
    file_format: 'ls',
  });

  server.on('login', ({ connection, username, password }, resolve, reject) => {
    if (username === _username && password === _password) {
      console.log('Authentication successful');

      // File downloaded
      connection.on('RETR', (error, filePath) => {
        if (error) {
          console.error(`FTP server error: could not send file path ${filePath} for download ${error}`);
          return;
        }
        console.log(`FTP server: download was successful - ${filePath}`);
      });

      // File uploaded
      connection.on('STOR', (error, fileName) => {
        if (error) { 
          console.error(`FTP server error: could not receive file ${fileName} for upload ${error}`);
          return;
        }
        console.info(`FTP server: upload successfully received - ${fileName}`); 
      });

      // File name changed
      connection.on('RNTO', (error, fileName) => {
        if (error) {
          console.error(`FTP server error: could not change file name ${fileName} - ${error}`);
          return;
        }
        console.log(`FTP server: file name successfully changed - ${fileName}`);
      });

      // File deleted
      connection.on('RMD', (error, fileName) => {
        if (error) {
          console.error(`FTP server error: could not delete file name ${fileName} - ${error}`);
          return;
        }
        console.log(`FTP server: file successfully deleted - ${fileName}`);
      });

      // File deleted
      connection.on('DELE', (error, fileName) => {
        if (error) {
          console.error(`FTP server error: could not delete file name ${fileName} - ${error}`);
          return;
        }
        console.log(`FTP server: file successfully deleted - ${fileName}`);
      });
      
      resolve({ root: path.resolve('ftp-drive') });
    }
    reject(new Error('Invalid username or password'));
  });

  server.on('client-error', ({connection, context, error}) => {
    console.error(`FTP server error: error interfacing with client ${context} ${error}`); 
  });

  const closeFtpServer = async () => {
    await server.close(); 
  }; 

  server.listen().then(() => console.log('FTP server started'));

  return { 
    shutdownFunc: async () => { 
      await closeFtpServer(); 
    }, 
  };
};

module.exports = { 
  startServer
};
