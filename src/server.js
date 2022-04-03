const { FtpSrv, FileSystem } = require('ftp-srv');
const [username, password] = process.argv.slice(2);

const startFtpServer = async (username, password) => {
  const server = new FtpSrv();
  
  server.on('login', (data, resolve, reject) => {
    if(data.username === username && data.password === password){
      return resolve({ root: "/ftp-ipfs" });    
    }
    return reject(new errors.GeneralError('Invalid username or password', 401));
  });
  
  server.on('client-error', ({connection, context, error}) => {
    console.error(`FTP server error: error interfacing with client ${context} ${error}`); 
  });
  
  // File downloaded
  server.on('RETR', (error, filePath) => {
    console.log('DOWNLOAD', filePath)
  });
  
  // File uploaded
  server.on('STOR', (error, fileName) => {
    console.log('UPLOAD', fileName)
  });
  
  // File name changed
  server.on('RNTO', (error, fileName) => {
    console.log('RENAME', fileName)
  });
  
  const closeFtpServer = async () => { 
    await server.close(); 
  }; 
    
  server.listen().then(() => console.log('FTP backup server is starting...'));

  return { 
    shutdownFunc: async () => { 
      await closeFtpServer(); 
    },
  };
};

(async () => {
  await startFtpServer(username, password);
})();
