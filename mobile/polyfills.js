// Polyfill'leri global olarak tanımla
import { Buffer } from 'buffer';
import 'react-native-get-random-values';

// Global nesneleri tanımla
global.Buffer = Buffer;
global.process = global.process || {};
global.process.env = global.process.env || {};
global.process.browser = false;

// Web API polyfill'leri
if (typeof ReadableStream === 'undefined') {
  const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill');
  global.ReadableStream = ReadableStream;
  global.WritableStream = WritableStream;
  global.TransformStream = TransformStream;
}

if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('text-encoding');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}