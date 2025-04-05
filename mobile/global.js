// Web API polyfill'leri
import { Blob, File, FormData, Headers, Request, Response, fetch } from 'undici';

// Global nesneleri tanımla
Object.assign(global, {
  Blob,
  File,
  FormData,
  Headers,
  Request,
  Response,
  fetch,
  ReadableStream: ReadableStream || null,
});

// Eğer ReadableStream tanımlı değilse, web-streams-polyfill'den al
if (!global.ReadableStream) {
  const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill');
  global.ReadableStream = ReadableStream;
  global.WritableStream = WritableStream;
  global.TransformStream = TransformStream;
}