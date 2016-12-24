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

export function getLyricsFrameSize(descriptionSize, lyricsSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const languageSize = 3;
    const bomSize = 2;
    const descriptionUtf16Size = descriptionSize * 2;
    const separatorSize = 2;
    const lyricsUtf16Size = lyricsSize * 2;

    return headerSize + encodingSize + languageSize + bomSize + descriptionUtf16Size + separatorSize + bomSize + lyricsUtf16Size;
}

export function getPictureFrameSize(pictureSize, mimeTypeSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const nullSize = 1;
    const pictureTypeSize = 1;

    return headerSize + encodingSize + mimeTypeSize + nullSize + pictureTypeSize + nullSize + pictureSize;
}

export function getCommentFrameSize(descriptionSize, textSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const languageSize = 3;
    const bomSize = 2;
    const descriptionUtf16Size = descriptionSize * 2;
    const separatorSize = 2;
    const textUtf16Size = textSize * 2;

    return headerSize + encodingSize + languageSize + bomSize + descriptionUtf16Size + separatorSize + bomSize + textUtf16Size;
}

export function getUserStringFrameSize(descriptionSize, valueSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const bomSize = 2;
    const descriptionUtf16Size = descriptionSize * 2;
    const separatorSize = 2;
    const valueUtf16Size = valueSize * 2;

    return headerSize + encodingSize + bomSize + descriptionUtf16Size + separatorSize + bomSize + valueUtf16Size;
}

export function getUrlLinkFrameSize(urlSize) {
    const headerSize = 10;

    return headerSize + urlSize;
}

export function getTotalFrameSize(frames) {
    return frames.reduce((sum, frame) => {
        return sum + frame.size;
    }, 0);
}
