export type EncryptedFileBlob = {
    blob: Blob;
    iv: string;
    encryptedSize: number;
};
export declare function encryptFileBlob(chatKeyBase64: string, file: Blob): Promise<EncryptedFileBlob>;
export declare function decryptFileBlob(chatKeyBase64: string, encryptedBlob: Blob, ivBase64: string, mime?: string): Promise<Blob>;
//# sourceMappingURL=fileCrypto.d.ts.map