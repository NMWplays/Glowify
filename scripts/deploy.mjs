import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const appData = process.env.APPDATA;
if (!appData) {
  console.error('APPDATA is not set – are you on Windows?');
  process.exit(1);
}

const themeDir = join(appData, 'SpotiKit', 'Themes', 'Glowify V2');
mkdirSync(themeDir, { recursive: true });

copyFileSync('dist/theme.js', join(themeDir, 'theme.js'));

const manifest = join(themeDir, 'spotikit.json');
if (!existsSync(manifest)) {
  writeFileSync(manifest, JSON.stringify({
    type: 'theme',
    name: 'Glowify V2',
    description: '',
    authors: [],
    tags: [],
    spotify: '1.3.6 - 1.3.8',
    style: 'theme.css',
    main: 'theme.js',
    windowControls: 'custom',
  }, null, 2) + '\n');
}

console.log(`Deployed to ${themeDir}`);
