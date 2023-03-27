export function getEmptyBuffer() {
  return new ArrayBuffer(0);
}

export const id3Header = [
  73,
  68,
  51, // ID3 magic nubmer
  3,
  0, // version
  0, // flags
];
