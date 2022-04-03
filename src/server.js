const { FtpSrv, FileSystem } = require('ftp-srv');

const startFtpServer = async () => {
  const server = new FtpSrv();
  
  server.on('login', (data, resolve, reject) => {
    // resolve({ root: '../DB/2' });
  });
  
  server.on('client-error', ({connection, context, error}) => {
    console.error(`FTP server error: error interfacing with client ${context} ${error}`); 
  });
  
  // File downloaded
  server.on('RETR', (error, filePath) => {});
  
  // File uploaded
  server.on('STOR', (error, fileName) => {});
  
  // File name changed
  server.on('RNTO', (error, fileName) => {});
  
  const closeFtpServer = async () => { 
    await server.close(); 
  }; 
    
  await server.listen();

  return { 
    shutdownFunc: async () => { 
      await closeFtpServer(); 
    },
  };
};

module.exports = {
  startFtpServer,
  default: startFtpServer,
}
