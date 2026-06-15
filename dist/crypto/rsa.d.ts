export declare function generateRsaKeyPair(): Promise<{
    publicKey: string;
    privateKey: string;
}>;
export declare function importRsaPublicKey(publicKeyBase64: string): Promise<CryptoKey>;
export declare function importRsaPrivateKey(privateKeyBase64: string): Promise<CryptoKey>;
export declare function rsaEncrypt(publicKeyBase64: string, plaintext: string): Promise<string>;
export declare function rsaDecrypt(privateKeyBase64: string, encryptedBase64: string): Promise<string>;
//# sourceMappingURL=rsa.d.ts.map