import { spawnSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf-8'));
const distDir = resolve(root, 'dist');
const outFile = resolve(root, `designpick-v${version}.zip`);

if (!existsSync(distDir)) {
  console.error('dist/ not found — run npm run build first.');
  process.exit(1);
}

const result = spawnSync('zip', ['-r', outFile, '.'], {
  cwd: distDir,
  stdio: 'inherit',
});

if (result.error?.code === 'ENOENT') {
  console.error('zip command not found.');
  console.error('Windows: powershell Compress-Archive dist designpick.zip');
  process.exit(1);
}

if (result.status !== 0) {
  console.error('zip failed.');
  process.exit(1);
}

console.log(`\nCreated designpick-v${version}.zip`);
