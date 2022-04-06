const IPFS = require('ipfs-core');
const fs = require('fs');
const compressing = require('compressing');
const CryptoJS = require("crypto-js");
const ipfsCluster = require('ipfs-cluster-api');
let ipfs;
let cluster;

const add = async () => {
  const { path: cid } = await ipfs.add('sdafsief;aoirp32jr34rf-piaoifsdpfasd;fn;dlasiop834potiawfoin;aiofshdsff;asoifh;afsdihf;is');
  console.log(cid);
  cluster.pin.add(cid);
  cluster.peers.ls([(err, res) => console.log(err ? err : res)]);
};

const fileAdded = async (fileName) => {

};

const startIPFSNode = async () => {
  ipfs = await IPFS.create({
    repo: './.jsipfs2'
  })
  const { Swarm } = ipfs.ipns.options.config.Addresses;
  cluster = ipfsCluster(Swarm[1]); // TODO: This is not initialising correctly
  add();
};

module.exports = {
  startIPFSNode,
  fileAdded
};
