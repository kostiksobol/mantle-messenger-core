export declare const DEFAULT_LOCAL_IPFS_API_URL = "http://127.0.0.1:5001/api/v0";
export declare const DEFAULT_IPFS_GATEWAY_URL = "https://ipfs.io/ipfs";
export type LocalIpfsStatus = {
    state: "checking";
    apiUrl: string;
    message: string;
} | {
    state: "connected";
    apiUrl: string;
    version?: string;
    message: string;
} | {
    state: "disconnected";
    apiUrl: string;
    message: string;
};
export type UploadedIpfsBlob = {
    hash: string;
    url: string;
    encryptedSize: number;
};
export declare function createLocalIpfsClient(apiUrl?: string): any;
export declare function checkLocalIpfs(apiUrl?: string): Promise<LocalIpfsStatus>;
export declare function ipfsHashToGatewayUrl(hash: string, gatewayUrl?: string): string;
export declare function uploadBlobToLocalIpfs(blob: Blob, apiUrl?: string): Promise<UploadedIpfsBlob>;
export declare function downloadIpfsUrl(url: string): Promise<Blob>;
//# sourceMappingURL=localIpfs.d.ts.map