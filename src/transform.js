export function uint32ToUint8Array(uint32) {
    const eightBitMask = (1 << 8) - 1;

    return [
        (uint32 >>> 24) & eightBitMask,
        (uint32 >>> 16) & eightBitMask,
        (uint32 >>> 8) & eightBitMask,
        uint32 & eightBitMask
    ];
}

export function uint28ToUint7Array(uint28) {
    const sevenBitMask = (1 << 7) - 1;

    return [
        (uint28 >>> 21) & sevenBitMask,
        (uint28 >>> 14) & sevenBitMask,
        (uint28 >>> 7) & sevenBitMask,
        uint28 & sevenBitMask
    ];
}

export function uint7ArrayToUint28(uint7Array) {
    let uint28 = 0;

    uint28 += uint7Array[0] << 21;
    uint28 += uint7Array[1] << 14;
    uint28 += uint7Array[2] << 7;
    uint28 += uint7Array[3];

    return uint28;
}
