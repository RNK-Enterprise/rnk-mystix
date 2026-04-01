import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = process.cwd();
const moduleJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'module.json'), 'utf8'));
const version = moduleJson.version;
const tempDir = path.join(repoRoot, '.release-temp');
const moduleZip = path.join(repoRoot, 'module.zip');
const versionedZip = path.join(repoRoot, 'zips', `rnk-mystix-v${version}.zip`);

fs.rmSync(tempDir, { recursive: true, force: true });
fs.mkdirSync(tempDir, { recursive: true });
fs.mkdirSync(path.join(repoRoot, 'zips'), { recursive: true });

for (const includePath of ['languages', 'src', 'styles', 'templates', 'LICENSE', 'README.md', 'CHANGELOG.md', 'module.json', 'package.json']) {
  fs.cpSync(path.join(repoRoot, includePath), path.join(tempDir, includePath), { recursive: true });
}

fs.rmSync(moduleZip, { force: true });
fs.rmSync(versionedZip, { force: true });

execFileSync('powershell.exe', [
  '-NoProfile',
  '-Command',
  `Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${moduleZip}' -Force`
], { stdio: 'inherit' });

fs.copyFileSync(moduleZip, versionedZip);
fs.rmSync(tempDir, { recursive: true, force: true });

console.log(`Built module.zip and ${path.relative(repoRoot, versionedZip)}`);