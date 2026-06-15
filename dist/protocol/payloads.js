function parseJson(value) {
    if (typeof value !== "string") {
        return value;
    }
    try {
        return JSON.parse(value);
    }
    catch {
        return undefined;
    }
}
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function isString(value) {
    return typeof value === "string";
}
function isNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}
function stringValue(value) {
    return isString(value) && value ? value : undefined;
}
function nestedStringValue(value, key) {
    if (!isRecord(value)) {
        return undefined;
    }
    return stringValue(value[key]);
}
function parseAttachments(value) {
    if (value === undefined)
        return undefined;
    if (!Array.isArray(value))
        return undefined;
    const attachments = [];
    for (const item of value) {
        if (!isRecord(item))
            return undefined;
        const { url, name, mime, size, iv, encryptedSize } = item;
        if (!isString(url) || !url)
            return undefined;
        if (!isString(name) || !name)
            return undefined;
        if (!isString(mime) || !mime)
            return undefined;
        if (!isNumber(size) || size < 0)
            return undefined;
        if (!isString(iv) || !iv)
            return undefined;
        if (encryptedSize !== undefined &&
            (!isNumber(encryptedSize) || encryptedSize < 0)) {
            return undefined;
        }
        attachments.push({
            url,
            name,
            mime,
            size,
            iv,
            ...(encryptedSize !== undefined ? { encryptedSize } : {}),
        });
    }
    return attachments;
}
export function encodePayload(payload) {
    return JSON.stringify(payload);
}
export function createMainInvitationPayload(chatKeyOrInput, creator) {
    if (typeof chatKeyOrInput === "string") {
        if (!creator) {
            throw new Error("Main invitation creator is missing");
        }
        return {
            chatKey: chatKeyOrInput,
            creator,
        };
    }
    return {
        chatKey: chatKeyOrInput.chatKey,
        creator: chatKeyOrInput.creator,
    };
}
export function createChatCreationPayload(nameOrInput) {
    return {
        event: "ChatCreation",
        name: typeof nameOrInput === "string" ? nameOrInput : nameOrInput.name,
    };
}
export function createInvitationPayload(invitedOrInput) {
    return {
        event: "Invitation",
        invited: typeof invitedOrInput === "string" ? invitedOrInput : invitedOrInput.invited,
    };
}
export function createMessagePayload(text, attachments) {
    return {
        event: "Message",
        text,
        ...(attachments && attachments.length > 0 ? { attachments } : {}),
    };
}
export function parseMainInvitationPayload(value) {
    const parsed = parseJson(value);
    if (!isRecord(parsed))
        return undefined;
    const chatKey = stringValue(parsed.chatKey) ?? nestedStringValue(parsed.chatKey, "chatKey");
    const creator = stringValue(parsed.creator) ?? nestedStringValue(parsed.chatKey, "creator");
    if (!chatKey)
        return undefined;
    if (!creator)
        return undefined;
    return {
        chatKey,
        creator,
    };
}
export function parseChatEventPayload(value) {
    const parsed = parseJson(value);
    if (!isRecord(parsed))
        return undefined;
    if (parsed.event === "ChatCreation") {
        const name = stringValue(parsed.name) ?? nestedStringValue(parsed.name, "name");
        if (!name)
            return undefined;
        return {
            event: "ChatCreation",
            name,
        };
    }
    if (parsed.event === "Invitation") {
        const invited = stringValue(parsed.invited) ?? nestedStringValue(parsed.invited, "invited");
        if (!invited)
            return undefined;
        return {
            event: "Invitation",
            invited,
        };
    }
    if (parsed.event === "Message") {
        if (!isString(parsed.text))
            return undefined;
        const attachments = parseAttachments(parsed.attachments);
        if (parsed.attachments !== undefined && !attachments) {
            return undefined;
        }
        return {
            event: "Message",
            text: parsed.text,
            ...(attachments && attachments.length > 0 ? { attachments } : {}),
        };
    }
    return undefined;
}
