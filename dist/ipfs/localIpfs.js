import { create } from "kubo-rpc-client";
export const DEFAULT_LOCAL_IPFS_API_URL = "http://127.0.0.1:5001/api/v0";
export const DEFAULT_IPFS_GATEWAY_URL = "https://ipfs.io/ipfs";
export function createLocalIpfsClient(apiUrl = DEFAULT_LOCAL_IPFS_API_URL) {
    return create({
        url: apiUrl,
    });
}
function errorMessage(error) {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    return String(error);
}
export async function checkLocalIpfs(apiUrl = DEFAULT_LOCAL_IPFS_API_URL) {
    try {
        const client = createLocalIpfsClient(apiUrl);
        const versionInfo = await client.version();
        return {
            state: "connected",
            apiUrl,
            version: versionInfo.version,
            message: versionInfo.version
                ? `Connected to local IPFS node ${versionInfo.version}`
                : "Connected to local IPFS node",
        };
    }
    catch (error) {
        return {
            state: "disconnected",
            apiUrl,
            message: errorMessage(error),
        };
    }
}
export function ipfsHashToGatewayUrl(hash, gatewayUrl = DEFAULT_IPFS_GATEWAY_URL) {
    const normalizedGatewayUrl = gatewayUrl.replace(/\/$/, "");
    return `${normalizedGatewayUrl}/${encodeURIComponent(hash)}`;
}
export async function uploadBlobToLocalIpfs(blob, apiUrl = DEFAULT_LOCAL_IPFS_API_URL) {
    const client = createLocalIpfsClient(apiUrl);
    const result = await client.add(blob, {
        pin: true,
    });
    const hash = result.cid.toString();
    return {
        hash,
        url: ipfsHashToGatewayUrl(hash),
        encryptedSize: blob.size,
    };
}
export async function downloadIpfsUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch IPFS file: ${response.status}`);
    }
    return response.blob();
}
