// Polyfill'leri en başta yükle
import { ReadableStream, WritableStream, TransformStream } from 'web-streams-polyfill/ponyfill';
import { TextEncoder, TextDecoder } from 'text-encoding';
import { Buffer } from 'buffer';

// Global nesneleri tanımla
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Buffer = Buffer;

// Expo'yu başlat
import 'expo-router/entry';