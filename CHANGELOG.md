# Changelog

## v6.2.0

- Add `TCMP` frame support

## v6.1.0

- Add TypeScript declaration file

## v6.0.0

- **Breaking**: Now this library exports only as JS native module (not UMD) and use named export (not default export)

Migration on Nodejs:

```js
// v5 common js
const ID3Writer = require('browser-id3-writer');

// v5 esm interop
import ID3Writer from 'browser-id3-writer';

// v6
import { ID3Writer } from 'browser-id3-writer';
```

Migration on browsers:

```html
<!-- v5 -->
<script src="browser-id3-writer.js"></script>
<script>
  // your code using ID3Writer
</script>

<!-- v6 -->
<script type="module">
  import { ID3Writer } from 'browser-id3-writer.mjs';
  // your code
</script>
```

## v5.0.0

- **Breaking**: Change `TDAT` frame type from number to string as some values is not possible to represent as number in JS (like 0212), so this change fixes ability to properly encode this frame in some situations:

```js
// v4
writer.setFrame('TDAT', 1234);

// v5
writer.setFrame('TDAT', '1234');
```

- **Breaking**: Drop Babel, so now this library requires ES6 native support (IE isn't supported anymore)
- Add `IPLS` and `SYLT` frames support

## v4.4.0

- Add language support for `COMM` and `USLT` frames:

```js
writer.setFrame('USLT', {
  language: 'jpn',
  description: '例えば',
  lyrics: 'サマータイム',
});
```

## v4.3.0

- Add `TLAN`, `TIT1`, `TIT3` frames

## v4.2.0

- Remove `TKEY` frame validation
- Support `TEXT` and `PRIV` frames

## v4.1.0

- Add support for `TCOP`, `TSRC` and `TDAT` frames

## v4.0.0

- **Breaking**: Now description of `APIC` frame is encoded in Western encoding by-default. That's because of a problem with iTunes and Finder on macOS. You can still encode it in Unicode encoding by specifying it:

```js
// v3
writer.setFrame('APIC', {
  type: 3,
  data: coverArrayBuffer,
  description: 'Продам гараж',
});

// v4
writer.setFrame('APIC', {
  type: 3,
  data: coverArrayBuffer,
  description: 'Продам гараж',
  useUnicodeEncoding: true, // that's dangerous
});
```

## v3.0.3

- Decrease library size from `8.68 kB` to `7.3 kB` in result of using rollup instead of webpack

## v3.0.2

- Now this library works in `IE10`. Just replaced `ArrayBuffer.prototype.slice` to `TypedArray.prototype.subarray`.

## v3.0.1

- No new features / bug fixes, but now readme in both Github and npm will contain exact library version and integrity to include it from CDN.

## v3.0.0

- **Breaking**: now only minified version of the lib is distributed and without maps. If you are using v2 browser-id3-writer.js from CDN update the link:

```html
<!-- v2 -->
<script src="//unpkg.com/browser-id3-writer@^2.0.0/dist/browser-id3-writer.js"></script>
<script src="//unpkg.com/browser-id3-writer@^2.0.0/dist/browser-id3-writer.min.js"></script>

<!-- v3 -->
<script src="https://unpkg.com/browser-id3-writer@3.0.0"></script>
```

- **Breaking**: no more "Unknown Artist" is added when you set `TPE1` or `TCOM` frames with empty array
- **Breaking**: `USLT` frame now accepts an object with keys description and lyrics:

```js
// v2
writer.setFrame('USLT', 'This is unsychronised lyrics');

// v3
writer.setFrame('USLT', {
  description: '',
  lyrics: 'This is unsychronised lyrics',
});
```

- **Breaking**: `APIC` frame now accepts an object with keys type (see `APIC` picture types), data and description:

```js
// v2
writer.setFrame('APIC', coverArrayBuffer);

// v3
writer.setFrame('APIC', {
  type: 3,
  data: coverArrayBuffer,
  description: '',
});
```

- Add support for next frames: `COMM`, `TXXX`, `WCOM`, `WCOP`, `WOAF`, `WOAR`, `WOAS`, `WORS`, `WPAY`, `WPUB`, `TKEY`, `TMED`, `TPE4`, `TPE3` and `TBPM`. See readme for usage info.
