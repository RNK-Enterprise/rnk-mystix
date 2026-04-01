import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const moduleJsonPath = path.join(repoRoot, 'module.json');
const packageJsonPath = path.join(repoRoot, 'package.json');
const forbiddenPatterns = [
  new RegExp(`\\b${['a', 'i'].join('')}\\b`, 'i'),
  new RegExp(['artificial', 'intelligence'].join('\\s+'), 'i')
];

function fail(message) {
  console.error(`Validation failed: ${message}`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.release-temp'].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const moduleJson = readJson(moduleJsonPath);
const packageJson = readJson(packageJsonPath);

if (moduleJson.version !== packageJson.version) {
  fail(`Version mismatch: module.json=${moduleJson.version}, package.json=${packageJson.version}`);
}

if (moduleJson.protected !== false) {
  fail('Patreon-gated premium module must set protected to false');
}

const requiredFiles = [
  'module.json',
  'package.json',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'languages/en.json',
  'src/main.js',
  'src/apps/PointAssignmentHub.js',
  'src/hooks/init.js',
  'src/hooks/ready.js',
  'src/hooks/rolls.js',
  'src/hooks/sheets.js',
  'src/utils/actorUtils.js',
  'src/utils/pointUtils.js',
  'src/utils/storageUtils.js',
  'styles/mystix.css',
  'styles/points.css',
  'templates/hub.hbs',
  'templates/chat-points.hbs',
  'scripts/validate.mjs',
  'scripts/build-release.mjs'
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(repoRoot, relativePath))) {
    fail(`Missing required file: ${relativePath}`);
  }
}

const cappedFiles = requiredFiles.filter((file) => /\.(js|mjs|css|hbs|md)$/i.test(file));
for (const relativePath of cappedFiles) {
  const lineCount = fs.readFileSync(path.join(repoRoot, relativePath), 'utf8').split(/\r?\n/).length;
  if (lineCount > 500) fail(`${relativePath} exceeds 500 lines (${lineCount})`);
}

const pictographic = /[\u{1F300}-\u{1FAFF}]/u;
for (const fullPath of walk(repoRoot)) {
  const ext = path.extname(fullPath).toLowerCase();
  if (!['.js', '.json', '.md', '.css', '.hbs', '.mjs', '.txt'].includes(ext)) continue;
  const content = fs.readFileSync(fullPath, 'utf8');
  if (pictographic.test(content)) fail(`Pictographic character found in ${path.relative(repoRoot, fullPath)}`);
  if (!fullPath.endsWith('validate.mjs') && forbiddenPatterns.some((pattern) => pattern.test(content))) {
    fail(`Forbidden wording found in ${path.relative(repoRoot, fullPath)}`);
  }
}

console.log('rnk-mystix validation passed.');