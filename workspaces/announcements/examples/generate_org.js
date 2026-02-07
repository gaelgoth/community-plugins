#!/usr/bin/env node
// Run example:
//   node examples/generate_org.js -n 10 -o examples/org.generated.yaml

const fs = require('fs');
const path = require('path');

const DEFAULT_COUNT = 50;
const INPUT_PATH = path.resolve(__dirname, 'org.yaml');

const USERS_BLOCK = `---
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: guest
spec:
  memberOf: [guests]
---
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: user-1
spec:
  memberOf: [team-a, team-b]
---
apiVersion: backstage.io/v1alpha1
kind: User
metadata:
  name: user-2
spec:
  memberOf: [team-a]
---`;

function usage() {
  console.log('Usage: node generate_org.js [options]');
  console.log('Options:');
  console.log('  -n, --count <num>      number of generated teams (default 50)');
  console.log('  -o, --output <file>    path to write output (default: examples/org.generated.yaml)');
  console.log('  -h, --help             show this help');
}

function generateTeamDoc(i, prefix = 'generated-team') {
  const name = `${prefix}-${i}`;
  const display = `Generated Team ${i}`;
  return [
    '---',
    'apiVersion: backstage.io/v1alpha1',
    'kind: Group',
    'metadata:',
    `  name: ${name}`,
    'spec:',
    '  type: team',
    '  parent: backstage',
    '  children: []',
    '  members:',
    '    - guest',
    '    - user-1',
    '  profile:',
    `    displayName: ${display}`,
    ''
  ].join('\n');
}

function main() {
  const argv = process.argv.slice(2);

  function parseArgs(argv) {
    let count = DEFAULT_COUNT;
    let outFile = path.resolve(__dirname, 'org.generated.yaml');
    for (let i = 0; i < argv.length; i++) {
      const a = argv[i];
      if (a === '-h' || a === '--help') {
        usage();
        process.exit(0);
      }
      if (a === '-n' || a === '--count') {
        const v = argv[i + 1];
        if (v && !v.startsWith('-')) {
          count = parseInt(v, 10);
          i++;
        }
        continue;
      }
      if (a.startsWith('--count=')) {
        count = parseInt(a.split('=')[1], 10);
        continue;
      }
      if (a === '-o' || a === '--output') {
        const v = argv[i + 1];
        if (v && !v.startsWith('-')) {
          outFile = path.resolve(process.cwd(), v);
          i++;
        }
        continue;
      }
      if (a.startsWith('--output=')) {
        outFile = path.resolve(process.cwd(), a.split('=')[1]);
        continue;
      }
      // positional: numeric sets count, otherwise treat as output file
      const num = Number(a);
      if (!Number.isNaN(num) && Number.isInteger(num)) {
        count = parseInt(a, 10);
        continue;
      }
      outFile = path.resolve(process.cwd(), a);
    }
    return { count, outFile };
  }

  const { count, outFile } = parseArgs(argv);
  if (!Number.isInteger(count) || count < 0) {
    console.error('Invalid count:', count);
    process.exit(3);
  }

  if (!fs.existsSync(INPUT_PATH)) {
    console.error(`Input file not found: ${INPUT_PATH}`);
    process.exit(2);
  }

  // Always start output with the canonical users block, then generated groups
  const original = USERS_BLOCK.trim();

  const docs = [];
  for (let i = 1; i <= count; i++) {
    docs.push(generateTeamDoc(i));
  }

  const output = original + '\n\n' + docs.join('\n');

  fs.writeFileSync(outFile, output, 'utf8');
  console.log(`Wrote ${count} generated teams to ${outFile}`);
}

main();
