import ipfsClient from "ipfs-http-client";

const ipfs = ipfsClient("ipfs.infura.io", "5001", {
  protocol: "https"
});

export default ipfs;
