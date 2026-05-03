import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  let crc = 0xffffffff;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const combined = Buffer.concat([typeBytes, data]);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(combined));
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function generatePNG(size) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB

  // Purple (#6C63FF) background with a white ring (color-picker target)
  const raw = Buffer.alloc(size * (1 + size * 3));
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.38;
  const innerR = size * 0.22;

  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 3);
    raw[row] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const px = row + 1 + x * 3;
      const dx = x - cx;
      const dy = y - cy;
      const dist2 = dx * dx + dy * dy;

      if (dist2 <= innerR * innerR) {
        // Inner purple dot
        raw[px] = 108; raw[px + 1] = 99; raw[px + 2] = 255;
      } else if (dist2 <= outerR * outerR) {
        // White ring
        raw[px] = 255; raw[px + 1] = 255; raw[px + 2] = 255;
      } else {
        // Purple background
        raw[px] = 108; raw[px + 1] = 99; raw[px + 2] = 255;
      }
    }
  }

  const idat = deflateSync(raw);

  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

const outDir = resolve(__dirname, '../public/icons');
mkdirSync(outDir, { recursive: true });

for (const size of [16, 48, 128]) {
  writeFileSync(resolve(outDir, `icon${size}.png`), generatePNG(size));
  console.log(`Generated icon${size}.png (${size}x${size})`);
}
