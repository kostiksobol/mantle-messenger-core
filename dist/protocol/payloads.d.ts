export type MainInvitationPayload = {
    chatKey: string;
    creator: string;
};
export type ChatCreationPayload = {
    event: "ChatCreation";
    name: string;
};
export type InvitationPayload = {
    event: "Invitation";
    invited: string;
};
export type MessageAttachmentPayload = {
    url: string;
    name: string;
    mime: string;
    size: number;
    iv: string;
    encryptedSize?: number;
};
export type MessagePayload = {
    event: "Message";
    text: string;
    attachments?: MessageAttachmentPayload[];
};
export type ChatEventPayload = ChatCreationPayload | InvitationPayload | MessagePayload;
type MainInvitationPayloadInput = {
    chatKey: string;
    creator: string;
};
type ChatCreationPayloadInput = {
    name: string;
};
type InvitationPayloadInput = {
    invited: string;
};
export declare function encodePayload(payload: MainInvitationPayload | ChatEventPayload): string;
export declare function createMainInvitationPayload(input: MainInvitationPayloadInput): MainInvitationPayload;
export declare function createMainInvitationPayload(chatKey: string, creator: string): MainInvitationPayload;
export declare function createChatCreationPayload(input: ChatCreationPayloadInput): ChatCreationPayload;
export declare function createChatCreationPayload(name: string): ChatCreationPayload;
export declare function createInvitationPayload(input: InvitationPayloadInput): InvitationPayload;
export declare function createInvitationPayload(invited: string): InvitationPayload;
export declare function createMessagePayload(text: string, attachments?: MessageAttachmentPayload[]): MessagePayload;
export declare function parseMainInvitationPayload(value: unknown): MainInvitationPayload | undefined;
export declare function parseChatEventPayload(value: unknown): ChatEventPayload | undefined;
export {};
//# sourceMappingURL=payloads.d.ts.map