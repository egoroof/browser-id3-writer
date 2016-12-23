export function uint32ToUint8Array(uint32) {
    const uint8array = [];
    const eightBitMask = (1 << 8) - 1;

    for (let i = 24; i >= 0; i -= 8) {
        uint8array.push((uint32 >>> i) & eightBitMask);
    }
    return uint8array;
}

export function uint28ToUint7Array(uint28) {
    const uint7array = [];
    const sevenBitMask = (1 << 7) - 1;

    for (let i = 21; i >= 0; i -= 7) {
        uint7array.push((uint28 >>> i) & sevenBitMask);
    }
    return uint7array;
}

export function uint7ArrayToUint28(uint7Array) {
    let uint28 = 0;

    for (let i = 0, pow = 21; pow >= 0; pow -= 7, i++) {
        uint28 += uint7Array[i] << pow;
    }
    return uint28;
}
