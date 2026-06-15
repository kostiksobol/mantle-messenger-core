import type { Address } from "viem";
export type MessengerRuntimeConfig = {
    appNetwork: string;
    chainId: number;
    chainName: string;
    rpcUrl: string;
    mainConnectorAddress: Address | "";
    nativeCurrencyName: string;
    nativeCurrencySymbol: string;
    nativeCurrencyDecimals: number;
    blockExplorerUrl?: string;
};
export type MessengerRuntimeConfigOverride = {
    rpcUrl?: string;
    mainConnectorAddress?: Address | "";
    chainId?: number;
    chainName?: string;
    nativeCurrencyName?: string;
    nativeCurrencySymbol?: string;
    nativeCurrencyDecimals?: number;
    appNetwork?: string;
};
export type SavedMessengerRuntimeContext = {
    id: string;
    label: string;
    rpcUrl: string;
    mainConnectorAddress: Address;
    chainId: number;
    chainName: string;
    nativeCurrencyName: string;
    nativeCurrencySymbol: string;
    nativeCurrencyDecimals: number;
    appNetwork: string;
    createdAt: number;
    updatedAt: number;
};
export declare const MESSENGER_RUNTIME_CONFIG_STORAGE_KEY = "mantle-messenger:runtime-config:v1";
export declare const MESSENGER_RUNTIME_CONTEXTS_STORAGE_KEY = "mantle-messenger:runtime-contexts:v1";
export declare function getKnownChainMetadata(chainId: number): {
    chainName: string;
    nativeCurrencyName: string;
    nativeCurrencySymbol: string;
    nativeCurrencyDecimals: number;
    appNetwork: string;
};
export declare function getDefaultMessengerRuntimeConfig(): MessengerRuntimeConfig;
export declare function getMessengerRuntimeConfig(): MessengerRuntimeConfig;
export declare function saveMessengerRuntimeConfigOverride(override: MessengerRuntimeConfigOverride): void;
export declare function saveMessengerRuntimeConfig(config: MessengerRuntimeConfig): void;
export declare function resetMessengerRuntimeConfig(): void;
export declare function makeMessengerRuntimeContextId(args: {
    rpcUrl: string;
    mainConnectorAddress: Address;
    chainId: number;
}): string;
export declare function getSavedMessengerRuntimeContexts(): SavedMessengerRuntimeContext[];
export declare function saveMessengerRuntimeContext(context: Omit<SavedMessengerRuntimeContext, "id" | "createdAt" | "updatedAt"> & Partial<Pick<SavedMessengerRuntimeContext, "id" | "createdAt" | "updatedAt">>): SavedMessengerRuntimeContext;
export declare function deleteSavedMessengerRuntimeContext(id: string): void;
export declare function applySavedMessengerRuntimeContext(context: SavedMessengerRuntimeContext): void;
//# sourceMappingURL=runtimeConfig.d.ts.map