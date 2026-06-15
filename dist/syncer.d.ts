import type { Address, PublicClient } from "viem";
export type SyncerOptions = {
    ownerAddress: Address;
    publicClient: PublicClient;
    mainConnectorAddress?: Address;
};
export declare function startBlockchainSyncer(options: SyncerOptions): () => void;
//# sourceMappingURL=syncer.d.ts.map