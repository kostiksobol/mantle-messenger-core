export declare function generateChatKey(): string;
export declare function deriveChatId(chatKeyBase64: string): Promise<string>;
export declare function assertChatId(chatKeyBase64: string, chatId: string): Promise<void>;
export type ParsedMessageTag = {
    nonce: string;
    mac: string;
};
export declare function parseMessageTag(tag: string): ParsedMessageTag | undefined;
export declare function generateMessageTag(chatKeyBase64: string): Promise<string>;
export declare function isMessageTagForChat(chatKeyBase64: string, tag: string): Promise<boolean>;
//# sourceMappingURL=hmac.d.ts.map