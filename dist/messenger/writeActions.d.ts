import { type Address } from "viem";
import type { LocalChat, SelfProfile } from "../db";
import type { MessengerTransactionLayer } from "../chain/transactionLayer";
export type ChainUser = {
    userAddress: Address;
    login: string;
    name: string;
    pubkey: string;
    userContract: Address;
    kind: number;
    metadataURI: string;
};
export type MessengerWriteContext = {
    ownerAddress: Address;
    publicClient: any;
    transactions: MessengerTransactionLayer;
    selfProfile: SelfProfile;
    mainConnectorAddress: Address;
    addActivity?: (message: string) => void;
};
export type CreateChatInput = {
    name: string;
};
export type CreateChatResult = {
    chatId: string;
    chatKey: string;
};
export type SendChatMessageInput = {
    chat: LocalChat;
    text: string;
    files?: File[];
};
export type InviteChatMemberInput = {
    chat: LocalChat;
    target: string;
};
export declare function createChat(ctx: MessengerWriteContext, input: CreateChatInput): Promise<CreateChatResult>;
export declare function sendChatMessage(ctx: MessengerWriteContext, input: SendChatMessageInput): Promise<void>;
export declare function inviteChatMember(ctx: MessengerWriteContext, input: InviteChatMemberInput): Promise<void>;
//# sourceMappingURL=writeActions.d.ts.map