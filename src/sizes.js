export function getNumericFrameSize(frameSize) {
    const headerSize = 10;
    const encodingSize = 1;

    return headerSize + encodingSize + frameSize;
}

export function getStringFrameSize(frameSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const bomSize = 2;
    const frameUtf16Size = frameSize * 2;

    return headerSize + encodingSize + bomSize + frameUtf16Size;
}

export function getLyricsFrameSize(lyricsSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const languageSize = 3;
    const contentDescriptorSize = 2;
    const bomSize = 2;
    const lyricsUtf16Size = lyricsSize * 2;

    return headerSize + encodingSize + languageSize + bomSize + contentDescriptorSize + bomSize + lyricsUtf16Size;
}

export function getPictureFrameSize(frameSize, mimeTypeSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const nullSize = 1;
    const pictureTypeSize = 1;

    return headerSize + encodingSize + mimeTypeSize + nullSize + pictureTypeSize + nullSize + frameSize;
}

export function getTotalFrameSize(frames) {
    let size = 0;

    frames.forEach((frame) => {
        size += frame.size;
    });
    return size;
}
