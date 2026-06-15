import { normalizeAddress } from "./db";
import { generateRsaKeyPair } from "./crypto/rsa";
export function rsaStorageKey(ownerAddress) {
    return `mantle-private-messenger:rsa:${normalizeAddress(ownerAddress)}`;
}
export function saveRsaKeyPair(ownerAddress, keyPair) {
    localStorage.setItem(rsaStorageKey(ownerAddress), JSON.stringify(keyPair));
}
export function loadRsaKeyPair(ownerAddress) {
    if (!ownerAddress) {
        return undefined;
    }
    const raw = localStorage.getItem(rsaStorageKey(ownerAddress));
    if (!raw) {
        return undefined;
    }
    try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.publicKey === "string" &&
            typeof parsed.privateKey === "string") {
            return parsed;
        }
        return undefined;
    }
    catch {
        return undefined;
    }
}
export async function ensureRsaKeyPair(ownerAddress) {
    const existing = loadRsaKeyPair(ownerAddress);
    if (existing) {
        return existing;
    }
    const created = await generateRsaKeyPair();
    saveRsaKeyPair(ownerAddress, created);
    return created;
}
