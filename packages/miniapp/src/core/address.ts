import { getAddress, isAddress } from "viem";

/**
 * An address as it is shown everywhere in OPUS (the Portal, every mini-app and the wallet app): the EIP-55
 * checksum spelling, so the same address never looks different from one screen to the next. Text that is not an
 * address is returned as it is.
 */
export function displayAddress(address: string): string {
    return isAddress(address, { strict: false }) ? getAddress(address) : address;
}

/** `0x1234…abcd` for a small space: the first 6 and the last 4 characters of the checksum spelling. */
export function shortAddress(address: string): string {
    const full = displayAddress(address);
    return full.length <= 12 ? full : `${full.slice(0, 6)}…${full.slice(-4)}`;
}
