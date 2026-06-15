export type StoredRsaKeyPair = {
    publicKey: string;
    privateKey: string;
};
export declare function rsaStorageKey(ownerAddress: string): string;
export declare function saveRsaKeyPair(ownerAddress: string, keyPair: StoredRsaKeyPair): void;
export declare function loadRsaKeyPair(ownerAddress?: string): StoredRsaKeyPair | undefined;
export declare function ensureRsaKeyPair(ownerAddress: string): Promise<{
    publicKey: string;
    privateKey: string;
}>;
//# sourceMappingURL=localKeys.d.ts.map