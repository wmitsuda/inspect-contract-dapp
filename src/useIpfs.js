import { useState, useEffect } from "react";
import ipfsClient from "ipfs-http-client";

const useIpfs = () => {
  const [ipfs, setIpfs] = useState();
  useEffect(() => {
    const enableIpfs = async () => {
      const client = ipfsClient("ipfs.infura.io", "5001", {
        protocol: "https"
      });
      setIpfs(client);
    };
    enableIpfs();
  }, []);

  return { ipfs };
};

export default useIpfs;
