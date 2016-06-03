# Browser ID3 Writer

[![npm](https://img.shields.io/npm/v/browser-id3-writer.svg?style=flat-square)](https://www.npmjs.com/package/browser-id3-writer)
[![Travis](https://img.shields.io/travis/egoroof/browser-id3-writer.svg?style=flat-square)](https://travis-ci.org/egoroof/browser-id3-writer)

A pure JS library for writing [ID3 (v2.3)](http://id3.org/id3v2.3.0) tag to MP3 files in browsers and Node.js.
It can not read the tag so use another lib to do it.

**Note**: the library removes existing ID3 tag (v2.2, v2.3 and v2.4).

## Requirements

For browsers:
[Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays),
[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob),
[URL](https://developer.mozilla.org/en-US/docs/Web/API/URL).
Tested in latest Chrome, Firefox and IE11 (IE10 doesn't work).

Node.js 4, 5 and 6 are tested and works well.

## Demo

Demonstration is available here: [egoroof.ru/browser-id3-writer/](https://egoroof.ru/browser-id3-writer/)

## Installation

### Browser

You can include library via [npmcdn](https://npmcdn.com/):

**Warning**: better use exact version to protect yourself against breaking changes.

```html
<script src="//npmcdn.com/browser-id3-writer@^2.0.0/dist/browser-id3-writer.min.js"></script>
```

Or you can install via [npm](https://www.npmjs.com/) and get it from `dist` folder:

```
npm install browser-id3-writer --save
```

Or you can include it using browser module loaders like webpack or browserify:

```js
var ID3Writer = require('browser-id3-writer');
```

### Node.js

```
npm install browser-id3-writer --save
```

## Usage

### Browser

You should first get
[ArrayBuffer](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
of the song you would like to add ID3 tag.

For example you can create file input and use
[FileReader](https://developer.mozilla.org/en/docs/Web/API/FileReader)
:

```html
<input type="file" id="file" accept="audio/mpeg">
<script>
    document.getElementById('file').addEventListener('change', function () {
        if (!this.files.length) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = reader.result;
            // go next
        };
        reader.onerror = function () {
            // handle error
            console.error('Reader error', reader.error);
        };
        reader.readAsArrayBuffer(this.files[0]);
    });
</script>
```

To get arrayBuffer from remote server you can use
[XMLHttpRequest](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest)
:

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', urlToSongFile, true);
xhr.responseType = 'arraybuffer';
xhr.onload = function () {
    if (xhr.status === 200) {
        var arrayBuffer = xhr.response;
        // go next
    } else {
        // handle error
        console.error(xhr.statusText + ' (' + xhr.status + ')');
    }
};
xhr.onerror = function() {
    // handle error
    console.error('Network error');
}
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
      .setFrame('USLT', 'This is unsychronised lyrics')
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

### Node.js


```js
var ID3Writer = require('browser-id3-writer');
var fs = require('fs');

var songBuffer = fs.readFileSync('path_to_song.mp3');
var coverBuffer = fs.readFileSync('path_to_cover.jpg');

var writer = new ID3Writer(songBuffer);
writer.setFrame('TIT2', 'Home')
      .setFrame('TPE1', ['Eminem', '50 Cent'])
      .setFrame('TPE2', 'Eminem')
      .setFrame('TALB', 'Friday Night Lights')
      .setFrame('TYER', 2004)
      .setFrame('TRCK', '6/8')
      .setFrame('TPOS', '1/2')
      .setFrame('TCON', ['Soundtrack'])
      .setFrame('USLT', 'This is unsychronised lyrics')
      .setFrame('APIC', coverBuffer);
writer.addTag();

var taggedSongBuffer = new Buffer(writer.arrayBuffer);
fs.writeFileSync('song_with_tags.mp3', taggedSongBuffer);
```

## Browser memory control

When you generate URLs via `writer.getURL()` you should know
that whole file is kept in memory until you close the page or move to another one.
So if you generate lots of URLs in a single page you should manually free memory
after you finish downloading file:

```js
URL.revokeObjectURL(url); // if you know url or
writer.revokeURL(); // if you have access to writer
```

## Supported frames

Currently you can set next frames:

**array of strings:**

- TPE1 (song artists)
- TCOM (song composers)
- TCON (song genres)

**string**

- TIT2 (song title)
- TALB (album title)
- TPE2 (album artist)
- TRCK (song number in album): '5' or '5/10'
- TPOS (album disc number): '1' or '1/3'
- USLT (unsychronised lyrics)
- TPUB (label name)

**integer**

- TLEN (song duration in milliseconds)
- TYER (album release year)

**arrayBuffer**

- APIC (song cover): works with jpeg, png, gif, webp, tiff, bmp and ico
