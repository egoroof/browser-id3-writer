# Browser ID3 Writer

[![npm](https://img.shields.io/npm/v/browser-id3-writer.svg?style=flat-square)](https://www.npmjs.com/package/browser-id3-writer)
[![Travis](https://img.shields.io/travis/egoroof/browser-id3-writer.svg?style=flat-square)](https://travis-ci.org/egoroof/browser-id3-writer)
[![npm](https://img.shields.io/npm/l/browser-id3-writer.svg?style=flat-square)](https://github.com/egoroof/browser-id3-writer/blob/master/LICENSE.md)

This is a library for writing [ID3v2.3](http://id3.org/id3v2.3.0)
tag to audio files in browsers.
It can not read tag so use another lib to do it.

**Note**: the library removes existing ID3 tag (v2.2, v2.3 and v2.4).

## Browser requirements
- [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
- [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
- [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
- [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL)
- [TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)

## Install

You can include library via [npmcdn](https://npmcdn.com/):

```html
<script type="text/javascript" src="https://npmcdn.com/browser-id3-writer/dist/browser-id3-writer.min.js">
```

Or you can install via [npm](https://www.npmjs.com/) and get it from `dist` folder:

```
npm install browser-id3-writer
```

## Usage

You should first get **arrayBuffer** of the song you would like to add ID3 tag.

For example you can do it with `XMLHttpRequest`:

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', urlToSongFile, true);
xhr.responseType = 'arraybuffer';
xhr.onload = function () {
    if (xhr.status === 200) {
        var arrayBuffer = xhr.response;
    }
};
xhr.send();
```

Then init `ID3Writer` object, set frames and add a tag:

```js
var writer = new ID3Writer(arrayBuffer);
writer.setFrame('TIT2', 'Home')
    .setFrame('TPE1', ['Eminem', '50 Cent'])
    .setFrame('TPE2', 'Eminem')
    .setFrame('TALB', 'Friday Night Lights')
    .setFrame('TYER', 2004)
    .setFrame('TRCK', '6/8')
    .setFrame('TPOS', '1/2')
    .setFrame('TCON', ['Soundtrack'])
    .setFrame('APIC', coverArrayBuffer);
writer.addTag();

// now you can save it to file as you wish
var arrayBuffer = writer.arrayBuffer;
var blob = writer.getBlob();
var url = writer.getURL();
```

For example you can save file using [FileSaver.js](https://github.com/eligrey/FileSaver.js/):

```js
saveAs(blob, 'song with tags.mp3');
```

If you are writing chromium extension you can save file using
[Downloads API](https://developer.chrome.com/extensions/downloads):

```js
chrome.downloads.download({
    url: url,
    filename: 'song with tags.mp3'
});
```

## Memory control

When you generate URLs via `writer.getURL()` you should know
that whole file is kept in memory until you close the page or move to another one.
So if you generate lots of URLs in a single page you should manually free memory
calling `writer.revokeURL()` after you have done with that URL
when you have access to `writer` otherwise do it via `URL.revokeObjectURL(url)`
when you know URL.

## Supported frames

Currently you can set next frames:

**array of strings:**

- TPE1 (song artists)
- TCOM (song composers)
- TCON (song genre)

**string**

- TIT2 (song title)
- TALB (album title)
- TPE2 (album artist)
- TRCK (song number in album): 5 or '5/10'
- TPOS (album disc number): 1 or '1/3'

**integer**

- TLEN (song duration in milliseconds)
- TYER (album release year)

**arrayBuffer**

- APIC (song cover)