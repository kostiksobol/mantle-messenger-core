import Dexie from "dexie";
import { getMessengerRuntimeConfig } from "./runtimeConfig";
const runtimeConfig = getMessengerRuntimeConfig();
const appNetwork = runtimeConfig.appNetwork || `chain-${runtimeConfig.chainId}`;
const mainConnectorForDb = (runtimeConfig.mainConnectorAddress || "no-main-connector").toLowerCase();
const databaseName = `mantle-private-messenger:${appNetwork}:${runtimeConfig.chainId}:${mainConnectorForDb}`;
class MessengerDatabase extends Dexie {
    selfProfiles;
    knownUsers;
    chats;
    chatMembers;
    messages;
    attachmentFiles;
    constructor() {
        super(databaseName);
        this.version(4).stores({
            selfProfiles: "++id, &ownerAddress, userContract",
            knownUsers: "++id, ownerAddress, userAddress, login, userContract, &[ownerAddress+userAddress]",
            chats: "++id, ownerAddress, chatId, &[ownerAddress+chatId]",
            chatMembers: "++id, ownerAddress, chatId, userAddress, userContract, [ownerAddress+chatId], &[ownerAddress+chatId+userAddress]",
            messages: "++id, ownerAddress, chatId, authorAddress, authorUserContract, timestamp, [ownerAddress+chatId], &[ownerAddress+chatId+authorUserContract+sourceMessageIndex]",
            attachmentFiles: "++id, ownerAddress, chatId, url, [ownerAddress+chatId+url]",
        });
    }
}
export const db = new MessengerDatabase();
export function normalizeAddress(address) {
    return address.toLowerCase();
}
export function makeOwnerAddress(walletAddress) {
    return normalizeAddress(walletAddress);
}
