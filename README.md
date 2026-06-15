# Mantle Messenger Core

Reusable TypeScript core for Mantle Messenger.

This package contains the protocol/client logic used by a private on-chain messenger application. It is not a UI package and it is not a wallet adapter. Instead, it provides the reusable building blocks needed to build a messenger client on top of the Mantle Messenger Solidity contracts.

## Related repositories

Solidity contracts:

https://github.com/kostiksobol/mantle-messenger-contracts

This core package is built for those contracts and expects a compatible deployed `MainConnector` contract.

## What this package does

`mantle-messenger-core` provides:

* contract ABIs and helpers
* local message database logic
* blockchain sync logic
* messenger write actions
* chat and invitation protocol helpers
* encryption helpers
* local messenger RSA key helpers
* transaction layer types

It allows a frontend, agent, or another application to reuse the messenger protocol without duplicating the core logic.

## What this package does not do

This package does not provide:

* React components
* wallet connection UI
* wallet discovery
* CSS or application layout
* deployment scripts
* private EVM key management
* a hosted backend

The consuming application is responsible for wallet connection, UI, network selection, and transaction signing.

## How it fits into the system

The full system has three main layers:

```text
Solidity contracts
  On-chain registry, users, chats, messages, and invitations

messenger-core
  TypeScript protocol logic, local database, crypto helpers, sync, write actions

application
  UI, wallet connection, transaction signing, network selection
```

The application connects to a deployed `MainConnector` contract and uses this package to read, sync, and write messenger data.

## Installation

Install directly from GitHub:

```bash
npm install github:kostiksobol/mantle-messenger-core#main
```

Later this package can also be published to npm.

## Build

```bash
npm install
npm run build
```

The build output is generated in `dist`.

## Contracts requirement

This package expects a deployed `MainConnector` contract compatible with:

https://github.com/kostiksobol/mantle-messenger-contracts

A consuming application should know:

* RPC URL
* chain id
* deployed `MainConnector` address

The app should also validate that the configured `MainConnector` address actually contains contract bytecode and responds like the expected protocol contract.

## Key concepts

### MainConnector

`MainConnector` is the main on-chain entrypoint for the messenger protocol.

It is used for:

* user registration
* user lookup
* protocol contract discovery
* messenger write operations

The core package uses the ABI expected by the Solidity contracts repository.

### Public client

A public client is used for read-only blockchain operations.

Examples:

* reading user profile data
* reading chat state
* syncing events
* checking contract state

Read operations do not require a wallet signature.

### Transaction layer

The core package does not directly depend on a specific wallet.

Instead, the consuming application provides a transaction layer that knows how to send blockchain transactions.

This allows the same core logic to work with:

* browser wallets
* local private key signers
* backend signers
* agent signers
* future account abstraction flows

The transaction layer interface looks like this:

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

The application decides how `writeContract` is implemented.

## Wallet keys and messenger keys

The messenger uses two different key layers.

### EVM key

The EVM key signs blockchain transactions.

It can come from:

* a browser wallet
* a local signer
* an agent signer
* a backend signer

This key is used only for blockchain transactions.

### Messenger RSA key

The messenger RSA key is used for encrypted messenger invitations.

It is not a wallet key and it does not sign transactions.

The core package includes helpers for loading and creating messenger RSA keys for a user address.

## Typical integration flow

A consuming application usually does the following:

1. Connect or create a user wallet.
2. Create a viem public client for the selected network.
3. Create a transaction layer for the active signer.
4. Configure the deployed `MainConnector` address.
5. Use messenger-core to register users, sync chats, create chats, send messages, and handle invitations.

Example write context:

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
* `publicClient` is used for contract reads
* `transactions` is provided by the application
* `selfProfile` is the registered messenger profile
* `mainConnectorAddress` is the deployed protocol entrypoint

## Browser wallet transaction layer example

```ts
import type { Address } from "viem";
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

## Local signer transaction layer example

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

## Local database

The core package uses a local IndexedDB database for messenger state.

The consuming application should keep different networks and different `MainConnector` deployments separated. This prevents local state from different deployments from being mixed together.

For example, local state for Anvil and Mantle Sepolia should not share the same database namespace.

## Updating contract compatibility

If the Solidity contracts change, the core package must be updated too.

Typical update flow:

1. Change Solidity contracts in the contracts repository.
2. Deploy or redeploy the contracts.
3. Update ABI/types in this package.
4. Test sync and write actions against the new `MainConnector`.
5. Release or push the updated core package.

## Development

```bash
npm install
npm run build
```

Commit and push changes:

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
