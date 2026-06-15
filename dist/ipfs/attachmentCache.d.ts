import { type LocalAttachmentFile, type LocalMessageAttachment } from "../db";
export declare const MAX_CACHED_ATTACHMENT_SIZE_BYTES: number;
export type AttachmentFileKey = {
    ownerAddress: string;
    chatId: string;
    url: string;
};
export type PutCachedAttachmentFileInput = {
    ownerAddress: string;
    chatId: string;
    attachment: LocalMessageAttachment;
    blob: Blob;
};
export type CacheAttachmentFromIpfsInput = {
    ownerAddress: string;
    chatId: string;
    chatKey: string;
    attachment: LocalMessageAttachment;
};
export declare function getCachedAttachmentFile(input: AttachmentFileKey): Promise<LocalAttachmentFile | undefined>;
export declare function getCachedAttachmentFilesForChat(input: {
    ownerAddress: string;
    chatId: string;
}): Promise<LocalAttachmentFile[]>;
export declare function putCachedAttachmentFile(input: PutCachedAttachmentFileInput): Promise<LocalAttachmentFile>;
export declare function cacheAttachmentFromIpfs(input: CacheAttachmentFromIpfsInput): Promise<LocalAttachmentFile>;
//# sourceMappingURL=attachmentCache.d.ts.map