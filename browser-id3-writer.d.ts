declare module 'browser-id3-writer' {
  export const enum SynchronizedLyricsType {
    Other = 0,
    Lyrics = 1,

    /**
     * Text transcription
     */
    TextTranscription = 2,

    /**
     * Movement/part name (e.g. "Adagio")
     */
    MovementPartName = 3,

    /**
     * Events (e.g. "Don Quijote enters the stage")
     */
    Events = 4,

    /**
     * Chord (e.g. "Bb F Fsus")
     */
    Chord = 5,

    /**
     * Trivia/'pop up' information
     */
    Trivia = 6,
  }

  export const enum SynchronizedLyricsTimestampFormat {
    /**
     * Absolute time, 32 bit sized, using MPEG frames as unit
     */
    Frames = 0x01,

    /**
     * Absolute time, 32 bit sized, using milliseconds as unit
     */
    Milliseconds = 0x02,
  }

  // id3.org uses hex values for these. I'm keeping them as hex for consistency
  // with the documentation.
  export const enum ImageType {
    Other = 0x00,
    /**
     * 32x32 pixels 'file icon' (PNG only)
     */
    Icon = 0x01,

    /**
     * Other file icon
     */
    OtherIcon = 0x02,

    /**
     * Cover (front)
     */
    CoverFront = 0x03,

    /**
     * Cover (back)
     */
    CoverBack = 0x04,

    /**
     * Leaflet page
     */
    Leaflet = 0x05,

    /**
     * Media (e.g. label side of CD)
     */
    Media = 0x06,

    /**
     * Lead artist/lead performer/soloist
     */
    LeadArtist = 0x07,

    /**
     * Artist/performer
     */
    Artist = 0x08,

    Conductor = 0x09,

    /**
     * Band/Orchestra
     */
    Band = 0x0a,

    Composer = 0x0b,

    /**
     * Lyricist/text writer
     */
    Lyricist = 0x0c,

    /**
     * Recording location
     */
    RecordingLocation = 0x0d,

    /**
     * During recording
     */
    DuringRecording = 0x0e,

    /**
     * During performance
     */
    DuringPerformance = 0x0f,

    /**
     * Movie/video screen capture
     */
    MovieScreenCapture = 0x10,

    /**
     * A brightly coloured fish
     */
    BrightColouredFish = 0x11,

    Illustration = 0x12,

    /**
     * Band/artist logotype
     */
    BandLogotype = 0x13,

    /**
     * Publisher/Studio logotype
     */
    PublisherLogotype = 0x14,
  }

  export class ID3Writer {
    constructor(buffer: ArrayBufferLike);

    setFrame(id: 'TBPM' | 'TLEN' | 'TYER', value: number): this;

    setFrame(
      id:
        | 'TALB'
        | 'TCOP'
        | 'TDAT'
        | 'TEXT'
        | 'TIT1'
        | 'TIT2'
        | 'TIT3'
        | 'TKEY'
        | 'TLAN'
        | 'TMED'
        | 'TPE2'
        | 'TPE3'
        | 'TPE4'
        | 'TPOS'
        | 'TPUB'
        | 'TRCK'
        | 'TSRC',
      value: string,
    ): this;

    setFrame(id: 'TCOM' | 'TCON' | 'TPE1', value: readonly string[]): this;

    setFrame(
      id: 'USLT',
      value: {
        readonly description: string;
        readonly language?: string;
        readonly lyrics: string;
      },
    ): this;

    setFrame(
      id: 'APIC',
      value: {
        readonly description: string;
        readonly data: ArrayBufferLike;
        readonly mimeType: string;
        readonly type: ImageType;
        readonly useUnicodeEncoding?: boolean;
      },
    ): this;

    setFrame(
      id: 'TXXX',
      value: {
        readonly description: string;
        readonly value: string;
      },
    ): this;

    setFrame(
      id: 'WCOM' | 'WCOP' | 'WOAF' | 'WOAR' | 'WOAS' | 'WORS' | 'WPAY' | 'WPUB',
      value: URL | string,
    ): this;

    setFrame(
      id: 'COMM',
      value: {
        readonly language?: string;
        readonly description: string;
        readonly text: string;
      },
    ): this;

    setFrame(
      id: 'PRIV',
      value: {
        readonly id: string;
        readonly data: ArrayBufferLike;
      },
    ): this;

    setFrame(id: 'IPLS', value: readonly (readonly [string, string])[]): this;

    setFrame(
      id: 'SYLT',
      value: {
        readonly type: SynchronizedLyricsType;
        readonly text: readonly (readonly [string, number])[];
        readonly timestampFormat: SynchronizedLyricsTimestampFormat;
        readonly language?: string;
        readonly description?: string;
      },
    ): this;

    removeTag(): void;

    addTag(): ArrayBuffer;

    getBlob(): Blob;

    getURL(): URL;

    revokeURL(): void;
  }
}
