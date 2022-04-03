const IPFS = require('ipfs-core');
const ipfsCluster = require('ipfs-cluster-api');
const cluster = ipfsCluster('localhost', '9094', { protocol: 'http' });
