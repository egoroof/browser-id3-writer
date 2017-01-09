# Browser ID3 Writer [![npm package][npm-badge]][npm] [![Travis][build-badge]][build]

[build-badge]: https://img.shields.io/travis/egoroof/browser-id3-writer.svg?style=flat-square
[build]: https://travis-ci.org/egoroof/browser-id3-writer

[npm-badge]: https://img.shields.io/npm/v/browser-id3-writer.svg?style=flat-square
[npm]: https://www.npmjs.org/package/browser-id3-writer

Pure JS library for writing [ID3 (v2.3)](http://id3.org/id3v2.3.0) tag to MP3 files in browsers and Node.js.
It can't read the tag so use another lib to do it.

**Note**: the library removes existing ID3 tag (v2.2, v2.3 and v2.4).

## Table of Contents

- [Requirements](#requirements)
- [Demo](#demo)
- [Installation](#installation)
  - [Browser](#browser)
  - [Node.js](#nodejs)
- [Usage](#usage)
  - [Browser](#browser-1)
    1. [Get ArrayBuffer of song](#get-arraybuffer-of-song)
    2. [Add a tag](#add-a-tag)
    3. [Save file](#save-file)
  - [Node.js](#nodejs-1)
- [Browser memory control](#browser-memory-control)
- [Supported frames](#supported-frames)
  - [APIC picture types](#apic-picture-types)

## Requirements

For browsers:
[Typed Arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays),
[Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob),
[URL](https://developer.mozilla.org/en-US/docs/Web/API/URL).
Tested in latest Chrome, Firefox, Edge and IE11 (IE10 doesn't work).

Node.js 4 - 7 are tested and works well.

## Demo

Demonstration is available here: [egoroof.ru/browser-id3-writer/](https://egoroof.ru/browser-id3-writer/)

## Installation

This library is wrapped with [Universal Module Definition](https://github.com/umdjs/umd). This means you will not
have any problems to use it with different script loaders.

### Browser

You can include library via [unpkg](https://unpkg.com/) or save it to local machine:

```html
<script src="https://unpkg.com/browser-id3-writer@3.0.1" crossorigin="anonymous" integrity="sha384-DO3f9aU7EBMVLbqAqQR0fBTMgEkzm53RgWVsAg+cwab3e+68Cm3zf+SyQlKxf9tW"></script>
```

If you are using browser module loaders like `webpack` or `browserify` install it via [npm](https://www.npmjs.com/):

```
npm install browser-id3-writer --save
```

Then you will be able to use it:

```js
const ID3Writer = require('browser-id3-writer');
```

### Node.js

```
npm install browser-id3-writer --save
```

Or using [yarn](https://yarnpkg.com/):

```
yarn add browser-id3-writer
```

## Usage

### Browser

#### Get ArrayBuffer of song

You should first get
[ArrayBuffer](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
of the song you would like to add ID3 tag.

##### FileReader

For example you can create file input and use
[FileReader](https://developer.mozilla.org/en/docs/Web/API/FileReader):

```html
<input type="file" id="file" accept="audio/mpeg">
<script>
    document.getElementById('file').addEventListener('change', function () {
        if (!this.files.length) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function () {
            const arrayBuffer = reader.result;
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

##### XMLHttpRequest

To get arrayBuffer from remote server you can use
[XMLHttpRequest](https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest):

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', urlToSongFile, true);
xhr.responseType = 'arraybuffer';
xhr.onload = function () {
    if (xhr.status === 200) {
        const arrayBuffer = xhr.response;
        // go next
    } else {
        // handle error
        console.error(xhr.statusText + ' (' + xhr.status + ')');
    }
};
xhr.onerror = function() {
    // handle error
    console.error('Network error');
};
xhr.send();
```

##### Fetch

If you are ok with [browser support](http://caniuse.com/#search=fetch) of
[Fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) or you are using a
[polyfill](https://github.com/github/fetch) then getting arrayBuffer from remote server will look like this:

```js
fetch(urlToSongFile)
    .then(function (response) {
        if (!response.ok) {
            throw new Error(response.statusText + ' (' + response.status + ')');
        }

        return response.arrayBuffer();
    })
    .then(function (arrayBuffer) {
        // go next
    })
    .catch(function (error) {
        // handle error
        console.error('Request failed', error);
    });
```

#### Add a tag

Create new `ID3Writer` instance with arrayBuffer of your song, set frames and add a tag:

```js
const writer = new ID3Writer(arrayBuffer);
writer.setFrame('TIT2', 'Home')
      .setFrame('TPE1', ['Eminem', '50 Cent'])
      .setFrame('TPE2', 'Eminem')
      .setFrame('TALB', 'Friday Night Lights')
      .setFrame('TYER', 2004)
      .setFrame('TRCK', '6/8')
      .setFrame('TPOS', '1/2')
      .setFrame('TCON', ['Soundtrack'])
      .setFrame('TBPM', 128)
      .setFrame('WPAY', 'https://google.com')
      .setFrame('USLT', {
          description: 'Original lyrics',
          lyrics: 'This is unsychronised lyrics'
      })
      .setFrame('TXXX', {
          description: 'Release Info',
          value: 'Double vinyl version was limited to 2500 copies'
      })
      .setFrame('TKEY', 'Fbm')
      .setFrame('APIC', {
          type: 3,
          data: coverArrayBuffer,
          description: 'Super picture'
      });
writer.addTag();
```

#### Save file

Now you can save it to file as you want:

```js
const taggedSongBuffer = writer.arrayBuffer;
const blob = writer.getBlob();
const url = writer.getURL();
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
const ID3Writer = require('browser-id3-writer');
const fs = require('fs');

const songBuffer = fs.readFileSync('path_to_song.mp3');
const coverBuffer = fs.readFileSync('path_to_cover.jpg');

const writer = new ID3Writer(songBuffer);
writer.setFrame('TIT2', 'Home')
      .setFrame('TPE1', ['Eminem', '50 Cent'])
      .setFrame('TPE2', 'Eminem')
      .setFrame('TALB', 'Friday Night Lights')
      .setFrame('TYER', 2004)
      .setFrame('TRCK', '6/8')
      .setFrame('TPOS', '1/2')
      .setFrame('TCON', ['Soundtrack'])
      .setFrame('TBPM', 128)
      .setFrame('WPAY', 'https://google.com')
      .setFrame('USLT', {
          description: 'Original lyrics',
          lyrics: 'This is unsychronised lyrics'
      })
      .setFrame('TXXX', {
          description: 'Release Info',
          value: 'Double vinyl version was limited to 2500 copies'
      })
      .setFrame('TKEY', 'Fbm')
      .setFrame('APIC', {
          type: 3,
          data: coverBuffer,
          description: 'Super picture'
      });
writer.addTag();

const taggedSongBuffer = Buffer.from(writer.arrayBuffer);
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

Have not found needed frame? Open a new issue and we'll discuss it.

**array of strings:**

- TPE1 (song artists)
- TCOM (song composers)
- TCON (song genres)

**string**

- TIT2 (song title)
- TALB (album title)
- TPE2 (album artist)
- TPE3 (conductor/performer refinement)
- TPE4 (interpreted, remixed, or otherwise modified by)
- TRCK (song number in album): '5' or '5/10'
- TPOS (album disc number): '1' or '1/3'
- TPUB (label name)
- TKEY (initial key)
- TMED (media type)
- WCOM (commercial information)
- WCOP (copyright/Legal information)
- WOAF (official audio file webpage)
- WOAR (official artist/performer webpage)
- WOAS (official audio source webpage)
- WORS (official internet radio station homepage)
- WPAY (payment)
- WPUB (publishers official webpage)

**integer**

- TLEN (song duration in milliseconds)
- TYER (album release year)
- TBPM (beats per minute)

**object**

- COMM (comments):

```js
writer.setFrame('COMM', {
    description: 'description here',
    text: 'text here'
});
```

- USLT (unsychronised lyrics):

```js
writer.setFrame('USLT', {
    description: 'description here',
    lyrics: 'lyrics here'
});
```

- TXXX (user defined text):

```js
writer.setFrame('TXXX', {
    description: 'description here',
    value: 'value here'
});
```

- APIC (attached picture):

```js
writer.setFrame('APIC', {
    type: 3,
    data: coverArrayBuffer,
    description: 'description here'
});
```

### APIC picture types

| Type | Name                                |
|------|-------------------------------------|
| 0    | Other                               |
| 1    | 32x32 pixels 'file icon' (PNG only) |
| 2    | Other file icon                     |
| 3    | Cover (front)                       |
| 4    | Cover (back)                        |
| 5    | Leaflet page                        |
| 6    | Media (e.g. lable side of CD)       |
| 7    | Lead artist/lead performer/soloist  |
| 8    | Artist/performer                    |
| 9    | Conductor                           |
| 10   | Band/Orchestra                      |
| 11   | Composer                            |
| 12   | Lyricist/text writer                |
| 13   | Recording Location                  |
| 14   | During recording                    |
| 15   | During performance                  |
| 16   | Movie/video screen capture          |
| 17   | A bright coloured fish              |
| 18   | Illustration                        |
| 19   | Band/artist logotype                |
| 20   | Publisher/Studio logotype           |
