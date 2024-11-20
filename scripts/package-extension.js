import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

const distDir = 'dist';
const zipName = 'elegant-dark-pro.zip';

// Ensure dist directory exists
mkdirSync(distDir, { recursive: true });

// Copy manifest and update version
const manifest = JSON.parse(readFileSync('manifest.json', 'utf8'));
const package = JSON.parse(readFileSync('package.json', 'utf8'));
manifest.version = package.version;
writeFileSync(join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

// Copy icons
const iconSizes = [16, 32, 48, 128];
iconSizes.forEach(size => {
  copyFileSync(
    join('public', 'icons', `icon${size}.png`),
    join(distDir, 'icons', `icon${size}.png`)
  );
});

// Create zip file
execSync(`cd ${distDir} && zip -r ${zipName} ./*`);

console.log(`Extension packaged: ${join(distDir, zipName)}`);