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

export const MESSENGER_RUNTIME_CONFIG_STORAGE_KEY =
  "mantle-messenger:runtime-config:v1";

export const MESSENGER_RUNTIME_CONFIG_SESSION_KEY =
  "mantle-messenger:runtime-config-session:v1";

export const MESSENGER_RUNTIME_CONTEXTS_STORAGE_KEY =
  "mantle-messenger:runtime-contexts:v1";

function readSessionOverride(): MessengerRuntimeConfigOverride | undefined {
  if (typeof sessionStorage === "undefined") {
    return undefined;
  }

  try {
    const raw = sessionStorage.getItem(MESSENGER_RUNTIME_CONFIG_SESSION_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanNumber(value: unknown, fallback: number) {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function isAddress(value: unknown): value is Address {
  return typeof value === "string" && /^0x[a-fA-F0-9]{40}$/.test(value);
}

export function getKnownChainMetadata(chainId: number) {
  const known: Record<
    number,
    {
      chainName: string;
      nativeCurrencyName: string;
      nativeCurrencySymbol: string;
      nativeCurrencyDecimals: number;
      appNetwork: string;
    }
  > = {
    1: {
      chainName: "Ethereum",
      nativeCurrencyName: "Ether",
      nativeCurrencySymbol: "ETH",
      nativeCurrencyDecimals: 18,
      appNetwork: "ethereum",
    },
    11155111: {
      chainName: "Sepolia",
      nativeCurrencyName: "Sepolia Ether",
      nativeCurrencySymbol: "ETH",
      nativeCurrencyDecimals: 18,
      appNetwork: "sepolia",
    },
    31337: {
      chainName: "Anvil",
      nativeCurrencyName: "Ether",
      nativeCurrencySymbol: "ETH",
      nativeCurrencyDecimals: 18,
      appNetwork: "anvil",
    },
    5000: {
      chainName: "Mantle",
      nativeCurrencyName: "Mantle",
      nativeCurrencySymbol: "MNT",
      nativeCurrencyDecimals: 18,
      appNetwork: "mantle",
    },
    5003: {
      chainName: "Mantle Sepolia",
      nativeCurrencyName: "Mantle",
      nativeCurrencySymbol: "MNT",
      nativeCurrencyDecimals: 18,
      appNetwork: "mantle-sepolia",
    },
  };

  return known[chainId];
}

function inferChainIdFromRpcUrl(rpcUrl: string) {
  const value = rpcUrl.toLowerCase();

  if (
    value.includes("127.0.0.1") ||
    value.includes("localhost") ||
    value.includes("0.0.0.0") ||
    value.includes("anvil")
  ) {
    return 31337;
  }

  if (value.includes("mantle")) {
    return 5003;
  }

  return 5003;
}

function configFromParts(args: {
  rpcUrl: string;
  mainConnectorAddress: Address | "";
  chainId: number;
  chainName?: string;
  nativeCurrencyName?: string;
  nativeCurrencySymbol?: string;
  nativeCurrencyDecimals?: number;
  appNetwork?: string;
}): MessengerRuntimeConfig {
  const known = getKnownChainMetadata(args.chainId);

  return {
    appNetwork:
      cleanString(args.appNetwork) ||
      known?.appNetwork ||
      `chain-${args.chainId}`,
    chainId: args.chainId,
    chainName:
      cleanString(args.chainName) ||
      known?.chainName ||
      `Unknown chain ${args.chainId}`,
    rpcUrl: args.rpcUrl,
    mainConnectorAddress: args.mainConnectorAddress,
    nativeCurrencyName:
      cleanString(args.nativeCurrencyName) ||
      known?.nativeCurrencyName ||
      "Ether",
    nativeCurrencySymbol:
      cleanString(args.nativeCurrencySymbol) ||
      known?.nativeCurrencySymbol ||
      "ETH",
    nativeCurrencyDecimals: cleanNumber(
      args.nativeCurrencyDecimals,
      known?.nativeCurrencyDecimals || 18
    ),
  };
}

export function getDefaultMessengerRuntimeConfig(): MessengerRuntimeConfig {
  const rpcUrl =
    cleanString(import.meta.env.VITE_RPC_URL) ||
    "https://rpc.sepolia.mantle.xyz";

  const mainConnectorAddress =
    (cleanString(import.meta.env.VITE_MAIN_CONNECTOR_ADDRESS) as Address | "") ||
    "";

  return configFromParts({
    rpcUrl,
    mainConnectorAddress,
    chainId: inferChainIdFromRpcUrl(rpcUrl),
  });
}

export function getMessengerRuntimeConfig(): MessengerRuntimeConfig {
  const defaults = getDefaultMessengerRuntimeConfig();
  const override = readSessionOverride();

  if (!override || typeof override !== "object") {
    return defaults;
  }

  const rpcUrl = cleanString(override.rpcUrl) || defaults.rpcUrl;
  const chainId = cleanNumber(
    override.chainId,
    inferChainIdFromRpcUrl(rpcUrl)
  );

  return configFromParts({
    rpcUrl,
    mainConnectorAddress:
      (cleanString(override.mainConnectorAddress) as Address | "") ||
      defaults.mainConnectorAddress,
    chainId,
    chainName: override.chainName,
    nativeCurrencyName: override.nativeCurrencyName,
    nativeCurrencySymbol: override.nativeCurrencySymbol,
    nativeCurrencyDecimals: override.nativeCurrencyDecimals,
    appNetwork: override.appNetwork,
  });
}

export function saveMessengerRuntimeConfigOverride(
  override: MessengerRuntimeConfigOverride
) {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  sessionStorage.setItem(
    MESSENGER_RUNTIME_CONFIG_SESSION_KEY,
    JSON.stringify({
      rpcUrl: cleanString(override.rpcUrl),
      mainConnectorAddress:
        cleanString(override.mainConnectorAddress) as Address | "",
      chainId: override.chainId,
      chainName: cleanString(override.chainName),
      nativeCurrencyName: cleanString(override.nativeCurrencyName),
      nativeCurrencySymbol: cleanString(override.nativeCurrencySymbol),
      nativeCurrencyDecimals: override.nativeCurrencyDecimals,
      appNetwork: cleanString(override.appNetwork),
    })
  );
}

export function saveMessengerRuntimeConfig(config: MessengerRuntimeConfig) {
  saveMessengerRuntimeConfigOverride(config);
}

export function resetMessengerRuntimeConfig() {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(MESSENGER_RUNTIME_CONFIG_SESSION_KEY);
  }

  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(MESSENGER_RUNTIME_CONFIG_STORAGE_KEY);
  }
}

export function makeMessengerRuntimeContextId(args: {
  rpcUrl: string;
  mainConnectorAddress: Address;
  chainId: number;
}) {
  return `${args.chainId}:${args.mainConnectorAddress.toLowerCase()}:${args.rpcUrl.trim()}`;
}

function readSavedContextsRaw(): SavedMessengerRuntimeContext[] {
  if (typeof localStorage === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(MESSENGER_RUNTIME_CONTEXTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item) => {
        return (
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.rpcUrl === "string" &&
          isAddress(item.mainConnectorAddress) &&
          typeof item.chainId === "number"
        );
      })
      .map((item) => ({
        id: item.id,
        label: cleanString(item.label) || `Chain ${item.chainId}`,
        rpcUrl: cleanString(item.rpcUrl),
        mainConnectorAddress: item.mainConnectorAddress as Address,
        chainId: cleanNumber(item.chainId, 31337),
        chainName: cleanString(item.chainName) || `Unknown chain ${item.chainId}`,
        nativeCurrencyName: cleanString(item.nativeCurrencyName) || "Ether",
        nativeCurrencySymbol: cleanString(item.nativeCurrencySymbol) || "ETH",
        nativeCurrencyDecimals: cleanNumber(item.nativeCurrencyDecimals, 18),
        appNetwork: cleanString(item.appNetwork) || `chain-${item.chainId}`,
        createdAt: cleanNumber(item.createdAt, Date.now()),
        updatedAt: cleanNumber(item.updatedAt, Date.now()),
      }));
  } catch {
    return [];
  }
}

function writeSavedContexts(contexts: SavedMessengerRuntimeContext[]) {
  localStorage.setItem(
    MESSENGER_RUNTIME_CONTEXTS_STORAGE_KEY,
    JSON.stringify(contexts)
  );
}

export function getSavedMessengerRuntimeContexts() {
  return readSavedContextsRaw().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function saveMessengerRuntimeContext(
  context: Omit<SavedMessengerRuntimeContext, "id" | "createdAt" | "updatedAt"> &
    Partial<Pick<SavedMessengerRuntimeContext, "id" | "createdAt" | "updatedAt">>
) {
  const now = Date.now();

  const id =
    context.id ||
    makeMessengerRuntimeContextId({
      rpcUrl: context.rpcUrl,
      mainConnectorAddress: context.mainConnectorAddress,
      chainId: context.chainId,
    });

  const existing = readSavedContextsRaw();
  const previous = existing.find((item) => item.id === id);

  const nextContext: SavedMessengerRuntimeContext = {
    ...context,
    id,
    createdAt: previous?.createdAt || context.createdAt || now,
    updatedAt: now,
  };

  writeSavedContexts([
    nextContext,
    ...existing.filter((item) => item.id !== id),
  ]);

  return nextContext;
}

export function deleteSavedMessengerRuntimeContext(id: string) {
  writeSavedContexts(readSavedContextsRaw().filter((item) => item.id !== id));
}

export function applySavedMessengerRuntimeContext(
  context: SavedMessengerRuntimeContext
) {
  saveMessengerRuntimeConfigOverride(context);
  saveMessengerRuntimeContext(context);
}
