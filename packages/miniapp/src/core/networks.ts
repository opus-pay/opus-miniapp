/**
 * The two chains OPUS runs on. A wallet on any other chain gets the network warning. The full network details
 * (RPC, explorer, the USDC address) live in the Portal's Network page; this is only what the shell needs.
 */
export type ChainInfo = { chainId: number; name: string; testnet: boolean };

export const CHAINS: readonly ChainInfo[] = [
    { chainId: 137, name: "Polygon", testnet: false },
    { chainId: 80002, name: "Polygon Amoy", testnet: true },
];

export const chainOf = (chainId: number | undefined): ChainInfo | undefined =>
    CHAINS.find((c) => c.chainId === chainId);

/** A connected wallet on any chain other than Polygon or Polygon Amoy needs a warning. */
export const isUnsupportedChain = (chainId: number | undefined): boolean =>
    chainId !== undefined && chainOf(chainId) === undefined;
