const IPFS = require('ipfs-core');
const ipfsCluster = require('ipfs-cluster-api');
let ipfs;
let cluster;

const startIPFSNode = async () => {
  ipfs = await IPFS.create({
    repo: './ipfs/.jsipfs2',
    config: {
      API: '/ip4/127.0.0.1/tcp/9094'
    }
  })
  cluster = ipfsCluster('/ip4/127.0.0.1/tcp/9094');
};

const add = async () => {
  const { cid } = await ipfs.add('Hello world');
  cluster.pin.add(cid);
  return cid;
};

module.exports = {
  startIPFSNode
};
