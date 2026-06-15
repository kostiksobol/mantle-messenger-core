# Mantle Messenger Core

TypeScript core package for **Mantle Private Messenger**.

This package contains the reusable client/protocol layer for the messenger application. It is responsible for local message state, encryption helpers, contract ABI usage, blockchain sync, and high-level messenger write actions.

It is designed to work with the Solidity protocol contracts from:

https://github.com/kostiksobol/mantle-messenger-contracts

## What this package is

`@mantle/messenger-core` is the SDK-style core of the messenger.

It does not contain React UI.
It does not assume a specific wallet extension.
It does not own private blockchain keys.
It does not force a specific transaction signer.

Instead, it provides the protocol logic and expects the host application to provide a transaction layer.

## What this package includes

* Contract ABIs and contract helpers
* Messenger database schema and sync logic
* Message and chat models
* Encryption helpers
* Messenger RSA key helpers
* Chat invitation encryption/decryption
* High-level write actions
* Transaction layer abstraction
* Runtime configuration helpers
* IPFS-related helpers

## Relationship with Solidity contracts

This package is built specifically for the Solidity contracts in:

https://github.com/kostiksobol/mantle-messenger-contracts

The contracts repository contains the canonical on-chain protocol:

* `MainConnector`
* user registry logic
* messenger user/profile logic
* chat/message/invitation protocol contracts
* Foundry scripts
* Foundry tests

This TypeScript package expects a deployed `MainConnector` compatible with that protocol.

When the Solidity contracts change, the ABI/types used by this package must be updated to match the deployed contracts.

## Architecture boundary

The core package intentionally separates protocol logic from application-specific wallet logic.

### Core owns

* protocol data structures
* crypto helpers
* local database sync
* contract ABI usage
* messenger write actions
* transaction layer interface

### Host app owns

* UI
* wallet discovery
* browser wallet integration
* local EVM signer integration
* network switching UI
* developer configuration UI
* actual transaction signing implementation

## Two different key layers

This project uses two separate key types.

### 1. EVM / blockchain key

This key signs blockchain transactions.

It may live in:

* Rabby
* MetaMask
* SubWallet
* Talisman
* another browser wallet
* a local private key signer
* a future AI-agent signer

The EVM key is used only for blockchain transaction signing.

### 2. Messenger RSA key

This key is used by the messenger protocol for encrypted chat invitations.

It is handled by the messenger core helpers such as:

* `ensureRsaKeyPair(ownerAddress)`
* `loadRsaKeyPair(ownerAddress)`

The RSA key does not sign blockchain transactions.
The RSA key is not a wallet key.

Keeping these two layers separate is important.

## Transaction layer abstraction

The core package does not directly depend on a specific wallet.

Instead, the host application provides a `MessengerTransactionLayer`.

```ts
import type { Address, Hash } from "viem";

export type MessengerContractCall = {
  to: Address;
  data: `0x${string}`;
};

export type MessengerTransactionLayer = {
  writeContract(args: {
    address: Address;
    abi: any;
    functionName: string;
    args?: readonly unknown[];
  }): Promise<Hash>;

  sendCallsBatch?(calls: MessengerContractCall[]): Promise<boolean>;
};
```

This makes the core usable with:

* browser wallets
* local private key signers
* server-side signers
* agent signers
* custom transaction relayers
* account abstraction flows in the future

## Typical host application setup

A host application usually creates a write context like this:

```ts
import type { MessengerWriteContext } from "@mantle/messenger-core";

const ctx: MessengerWriteContext = {
  ownerAddress,
  publicClient,
  transactions,
  selfProfile,
  mainConnectorAddress,
};
```

Where:

* `ownerAddress` is the active messenger user address
* `publicClient` is a viem public client for contract reads
* `transactions` is the app-provided transaction layer
* `selfProfile` is the current registered messenger profile
* `mainConnectorAddress` is the deployed protocol entrypoint

Contract reads can use `publicClient`.

Contract writes go through `transactions`.

## Browser wallet example

A browser wallet transaction layer can be implemented in the host app:

```ts
import type { MessengerTransactionLayer } from "@mantle/messenger-core";

export function createBrowserWalletTransactions(args: {
  ownerAddress: Address;
  walletClient: any;
}): MessengerTransactionLayer {
  return {
    async writeContract(call) {
      return args.walletClient.writeContract({
        account: args.ownerAddress,
        ...call,
      });
    },
  };
}
```

## Local signer example

A local signer transaction layer can also be implemented outside the core package:

```ts
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type { MessengerTransactionLayer } from "@mantle/messenger-core";

export function createLocalSignerTransactions(args: {
  privateKey: `0x${string}`;
  chain: any;
  rpcUrl: string;
}): MessengerTransactionLayer {
  const account = privateKeyToAccount(args.privateKey);

  const walletClient = createWalletClient({
    account,
    chain: args.chain,
    transport: http(args.rpcUrl),
  });

  return {
    async writeContract(call) {
      return walletClient.writeContract({
        account,
        chain: args.chain,
        ...call,
      });
    },
  };
}
```

## Installation from GitHub

```bash
npm install github:kostiksobol/mantle-messenger-core#main
```

## Build

```bash
npm install
npm run build
```

The package builds TypeScript into `dist`.

## Package structure

Typical source layout:

```text
src/
  chain/
    transactionLayer.ts

  crypto/
    ...

  db.ts

  contracts.ts

  localKeys.ts

  messenger/
    syncer.ts
    writeActions.ts
    ...

  runtimeConfig.ts

  index.ts
```

## Runtime configuration

The package includes runtime configuration helpers for selecting:

* RPC URL
* chain id
* chain metadata
* deployed `MainConnector` address
* known network contexts

The host app may expose this through a developer UI.

The core package can store runtime overrides in local storage, but the host app decides how users interact with this configuration.

## Local database

The messenger uses a local IndexedDB database through Dexie.

Database namespaces should include network and `MainConnector` identity so that different deployments do not mix local message state.

This is important when switching between:

* local Anvil
* Mantle Sepolia
* custom test deployments
* future production deployments

## Contract compatibility

The package assumes the deployed `MainConnector` supports the protocol expected by the core.

A host app should validate:

* RPC URL is reachable
* chain id is correct
* `MainConnector` address has bytecode
* contract responds like the expected protocol entrypoint

## Publishing model

Currently this package can be used directly from GitHub:

```bash
npm install github:kostiksobol/mantle-messenger-core#main
```

Later it can be published as an npm package:

```bash
npm install @mantle/messenger-core
```

## Development workflow

When changing the core package:

```bash
npm run build
git add .
git commit -m "Update messenger core"
git push
```

Then update the consuming app:

```bash
npm install github:kostiksobol/mantle-messenger-core#main
```

## License

MIT
