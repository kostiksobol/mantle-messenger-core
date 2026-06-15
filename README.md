# Mantle Messenger Core

Reusable TypeScript core package for Mantle Private Messenger.

This package contains the protocol/client logic used by the Mantle Messenger web application. It is designed to be reused by different clients that want to interact with the same messenger protocol.

It does not provide UI.
It does not connect wallets by itself.
It does not deploy contracts.
It does not force a specific signer.

Instead, it provides the common protocol logic that an app can build on top of.

## Related repositories

### Web application

https://github.com/kostiksobol/mantle-private-messenger

The web app uses this package for messenger protocol logic and adds:

* React UI
* wallet discovery
* local signer management
* developer network switching UI
* browser-specific application logic

### Solidity contracts

https://github.com/kostiksobol/mantle-messenger-contracts

The contracts repository contains the canonical on-chain protocol that this package is built for.

This package expects a deployed `MainConnector` compatible with those contracts.

## What this package includes

`mantle-messenger-core` includes:

* contract ABIs and contract helpers
* local IndexedDB database schema
* blockchain sync logic
* messenger write actions
* chat and invitation protocol helpers
* encryption helpers
* messenger RSA key helpers
* IPFS attachment helpers
* runtime configuration helpers
* transaction layer types

## What this package does not include

This package does not include:

* React components
* CSS
* wallet connection buttons
* wallet provider discovery
* deployment scripts
* Solidity source code
* hosted backend services

The consuming application is responsible for UI, network selection, wallet connection, and transaction signing.

## System overview

The project is split into three layers:

```text
Solidity contracts
  On-chain protocol: users, registry, chats, messages, invitations

messenger-core
  TypeScript protocol/client layer: sync, local DB, crypto, write actions

application
  UI, wallet connection, local signers, network switching, user experience
```

This package sits between the contracts and the application.

## How the messenger protocol works

At a high level, the messenger works like this:

1. A user owns an EVM address.
2. The user registers that address in the messenger protocol through `MainConnector`.
3. During registration, the user provides messenger identity data such as login, display name, and messenger public key.
4. Other users can discover registered users through the on-chain registry.
5. Chats, messages, and invitations are written through smart contract transactions.
6. The client syncs protocol state from the blockchain.
7. Synced state is stored locally in IndexedDB.
8. The UI reads from the local database instead of manually querying every piece of state on every render.
9. Encrypted invitation data is handled with the messenger RSA key layer.

The blockchain is the shared source of truth.
The local database is a client-side cache/index of protocol state.

## MainConnector

`MainConnector` is the main on-chain entrypoint expected by the core package.

It is used for:

* user registration
* user lookup
* protocol writes
* resolving user/profile contracts
* discovering protocol state

The consuming app must provide the deployed `MainConnector` address.

## Reads and writes

The core separates reads and writes.

### Reads

Read-only operations use a public client.

Reads do not require a wallet signature.

Examples:

* read registered user profile
* read contract state
* sync blockchain events/state
* validate protocol configuration

### Writes

Write operations go through a transaction layer provided by the consuming application.

Writes require a signer because they create blockchain transactions.

Examples:

* register user
* create chat
* send message
* accept invitation
* update protocol state

## Transaction layer

The core package does not depend on a specific wallet.

Instead, the consuming application provides a transaction layer.

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
* backend signers
* agent signers
* account abstraction systems
* custom transaction relayers

The app decides how transactions are actually signed.

## EVM keys and messenger RSA keys

The protocol uses two different key layers.

### EVM key

The EVM key signs blockchain transactions.

It is used for:

* paying gas
* calling protocol contracts
* registering users
* creating chats
* sending messages

The EVM key may live in a browser wallet, local signer, backend signer, or agent signer.

### Messenger RSA key

The messenger RSA key is used for encrypted messenger data, especially encrypted invitations.

It is not a blockchain key.
It does not pay gas.
It does not sign EVM transactions.

The RSA key layer is tied to the messenger identity and is handled separately from the transaction signer.

## Local database

The core uses IndexedDB through Dexie.

The database stores synced messenger state locally, such as:

* registered profiles
* chats
* messages
* invitation state
* attachment metadata
* sync-related local state

The application should keep different protocol deployments separated by database namespace.

For example, Anvil and Mantle Sepolia should not share the same local protocol state.

A good namespace usually includes:

* app network
* chain id
* `MainConnector` address

## Runtime configuration

The package includes helpers for runtime protocol configuration.

A consuming application may allow developers to configure:

* RPC URL
* `MainConnector` address
* known protocol contexts

The app should validate a context before using it:

* RPC URL is reachable
* chain id can be read
* `MainConnector` address is valid
* contract bytecode exists
* contract responds like the expected protocol contract

## Installation

Install from GitHub:

```bash
npm install github:kostiksobol/mantle-messenger-core#main
```

## Build

```bash
npm install
npm run build
```

The package builds TypeScript into `dist`.

## Package exports

The package exposes the main entrypoint and several subpaths.

Examples:

```ts
import { ... } from "@mantle/messenger-core";
import { db } from "@mantle/messenger-core/db";
import { appChain } from "@mantle/messenger-core/wagmi";
import { MAIN_CONNECTOR_ADDRESS } from "@mantle/messenger-core/contracts";
import type { MessengerTransactionLayer } from "@mantle/messenger-core/chain/transactionLayer";
```

## Typical integration flow

A consuming app usually does this:

1. Select a network and RPC URL.
2. Configure the deployed `MainConnector` address.
3. Create a viem public client.
4. Connect a wallet or create a signer.
5. Create a transaction layer for that signer.
6. Load or create the messenger RSA key for the active address.
7. Register the user if needed.
8. Start blockchain sync.
9. Render local messenger state from IndexedDB.
10. Use core write actions to create chats, send messages, and process invitations.

## Example write context

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

* `ownerAddress` is the active user address
* `publicClient` is used for reads
* `transactions` is provided by the app
* `selfProfile` is the registered messenger profile
* `mainConnectorAddress` is the deployed protocol entrypoint

## Contract compatibility

This package is built for:

https://github.com/kostiksobol/mantle-messenger-contracts

If the Solidity contracts change, this package must be kept in sync.

Typical update flow:

1. Update contracts in the contracts repository.
2. Deploy the new contracts.
3. Update ABI/types in this package.
4. Test reads, sync, and write actions against the new `MainConnector`.
5. Push the updated core package.
6. Update consuming apps.

## Development workflow

Build:

```bash
npm run build
```

Commit and push:

```bash
git add .
git commit -m "Update messenger core"
git push
```

Update a consuming app:

```bash
npm install github:kostiksobol/mantle-messenger-core#main
```

## License

MIT
