import { validateMetaData } from "@hypercerts-org/sdk";

export const generateIPFSUrl = (cid: string) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

export const getMetadata = async (cid: string) => {
  const res = await fetch(generateIPFSUrl(cid));
  if (!res.ok) {
    throw new Error(`IPFS fetch failed: ${res.statusText}`);
  }
  const data = await res.json();

  const validationResult = validateMetaData(data);

  return validationResult;
};
