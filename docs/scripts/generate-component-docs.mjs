import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, '../src/index.ts');
const docsRoot = path.join(root, 'content/docs');
const componentsDir = path.join(docsRoot, 'components');

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase();
}

function cleanExportName(raw) {
  return raw.split(' as ')[0].trim();
}

function parseComponentNames(indexContent) {
  const names = new Set();
  const exportBlockRegex = /export\s*\{([^}]+)\}\s*from\s*['\"]\.\//g;

  for (const match of indexContent.matchAll(exportBlockRegex)) {
    const exportsChunk = match[1] ?? '';
    for (const raw of exportsChunk.split(',')) {
      const name = cleanExportName(raw);
      if (!name) continue;
      if (!/^[A-Z]/.test(name)) continue;
      if (name.endsWith('Props') || name.endsWith('Options')) continue;
      names.add(name);
    }
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

function componentPage(name) {
  const description = `${name} component from the Kami UI library.`;
  return `---
title: ${name}
description: ${description}
---

## Usage

\`\`\`tsx
import { ${name} } from '@jlgrimes/kami';
\`\`\`

## Example

\`\`\`tsx
<${name} />
\`\`\`

> Auto-generated from \`src/index.ts\`.
`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function removeStaleFiles(dir, keepSlugs) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.mdx')) continue;
    const slug = entry.name.replace(/\.mdx$/, '');
    if (keepSlugs.has(slug)) continue;
    await fs.unlink(path.join(dir, entry.name));
  }
}

async function main() {
  const indexContent = await fs.readFile(indexPath, 'utf8');
  const componentNames = parseComponentNames(indexContent);

  await ensureDir(componentsDir);

  const pages = [];
  for (const name of componentNames) {
    const slug = toKebabCase(name);
    pages.push(slug);
    await fs.writeFile(path.join(componentsDir, `${slug}.mdx`), componentPage(name), 'utf8');
  }

  await fs.writeFile(
    path.join(componentsDir, 'index.mdx'),
    `---
title: Components
description: Auto-generated component reference from Kami exports.
---

Kami currently exports **${componentNames.length}** components.

Add or remove component exports in \`src/index.ts\`, then run docs to regenerate this section.
`,
    'utf8',
  );

  await removeStaleFiles(componentsDir, new Set([...pages, 'index']));

  await fs.writeFile(
    path.join(componentsDir, 'meta.json'),
    JSON.stringify({ title: 'Components', pages: ['index', ...pages] }, null, 2) + '\n',
    'utf8',
  );

  await fs.writeFile(
    path.join(docsRoot, 'meta.json'),
    JSON.stringify({ title: 'Kami Docs', pages: ['index', 'components'] }, null, 2) + '\n',
    'utf8',
  );

  console.log(`Generated docs for ${componentNames.length} components.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
