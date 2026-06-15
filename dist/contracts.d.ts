import type { Address } from "viem";
export declare const MAIN_CONNECTOR_ADDRESS: Address | undefined;
export declare const ZERO_ADDRESS: "0x0000000000000000000000000000000000000000";
export declare const mainConnectorAbi: readonly [{
    readonly type: "event";
    readonly name: "RecordAdded";
    readonly inputs: readonly [{
        readonly name: "index";
        readonly type: "uint256";
        readonly indexed: true;
    }, {
        readonly name: "record";
        readonly type: "string";
        readonly indexed: false;
    }];
    readonly anonymous: false;
}, {
    readonly type: "function";
    readonly name: "register";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "login";
        readonly type: "string";
    }, {
        readonly name: "name";
        readonly type: "string";
    }, {
        readonly name: "pubkey";
        readonly type: "string";
    }, {
        readonly name: "kind";
        readonly type: "uint8";
    }, {
        readonly name: "metadataURI";
        readonly type: "string";
    }];
    readonly outputs: readonly [];
}, {
    readonly type: "function";
    readonly name: "addRecord";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "record";
        readonly type: "string";
    }];
    readonly outputs: readonly [];
}, {
    readonly type: "function";
    readonly name: "getLastRecords";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "string[]";
    }];
}, {
    readonly type: "function";
    readonly name: "getUserByAddress";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "userAddress";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "userAddress";
            readonly type: "address";
        }, {
            readonly name: "login";
            readonly type: "string";
        }, {
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly name: "pubkey";
            readonly type: "string";
        }, {
            readonly name: "userContract";
            readonly type: "address";
        }, {
            readonly name: "kind";
            readonly type: "uint8";
        }, {
            readonly name: "metadataURI";
            readonly type: "string";
        }];
    }];
}, {
    readonly type: "function";
    readonly name: "getUserByLogin";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "login";
        readonly type: "string";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "userAddress";
            readonly type: "address";
        }, {
            readonly name: "login";
            readonly type: "string";
        }, {
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly name: "pubkey";
            readonly type: "string";
        }, {
            readonly name: "userContract";
            readonly type: "address";
        }, {
            readonly name: "kind";
            readonly type: "uint8";
        }, {
            readonly name: "metadataURI";
            readonly type: "string";
        }];
    }];
}];
export declare const userContractAbi: readonly [{
    readonly type: "event";
    readonly name: "MessageAdded";
    readonly inputs: readonly [{
        readonly name: "index";
        readonly type: "uint256";
        readonly indexed: true;
    }, {
        readonly name: "tag";
        readonly type: "string";
        readonly indexed: false;
    }];
    readonly anonymous: false;
}, {
    readonly type: "function";
    readonly name: "owner";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "address";
    }];
}, {
    readonly type: "function";
    readonly name: "addMessage";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "encryptedContent";
        readonly type: "string";
    }, {
        readonly name: "tag";
        readonly type: "string";
    }];
    readonly outputs: readonly [];
}, {
    readonly type: "function";
    readonly name: "getLastMessages";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "from";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "encryptedContent";
            readonly type: "string";
        }, {
            readonly name: "tag";
            readonly type: "string";
        }, {
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
    }];
}, {
    readonly type: "function";
    readonly name: "getMessage";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "index";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "encryptedContent";
            readonly type: "string";
        }, {
            readonly name: "tag";
            readonly type: "string";
        }, {
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
    }];
}];
//# sourceMappingURL=contracts.d.ts.map