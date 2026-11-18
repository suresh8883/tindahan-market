#!/usr/bin/env node
// Static check of tests/web for patterns the workspace rules forbid. Exits 1 and prints file:line.
// Usage: npm run check:rules [-- other/dir]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/harness.mjs';

const target = path.resolve(ROOT, process.argv[2] ?? 'tests/web');

const CHECKS = [
  { rule: 'fixed sleep', pattern: /\bwaitForTimeout\s*\(|\bsetTimeout\s*\(|\bsleep\s*\(/ },
  { rule: 'CSS/XPath locator', pattern: /\.locator\s*\(|\bpage\.\$\$?\s*\(|\.\$\$?eval\s*\(|\.frameLocator\s*\(/ },
  { rule: 'CSS/XPath locator', pattern: /['"`](?:css=|xpath=|\/\/)/ },
  {
    rule: 'skipped or focused test',
    pattern: /\b(?:test|it|describe)(?:\.describe)?\.(?:skip|fixme|only|todo)\b|\b(?:xit|xdescribe|fit|fdescribe)\s*\(/,
  },
  {
    rule: 'hard-coded secret',
    pattern:
      /\b(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?key|auth[_-]?token|token|bearer)\b["']?\s*[:=]\s*["'`][^"'`$]{4,}|\bBearer\s+[A-Za-z0-9._~+/-]{8,}|\b(?:ghp_|gho_|glpat-|sk-|AKIA|xox[bp]-)[A-Za-z0-9_-]{10,}|mock-wallet-sandbox-\d{8}/i,
  },
];

/** Blanks comments but keeps line numbers and string contents, so a TODO or a note is not a violation. */
function stripComments(source) {
  let out = '';
  let state = 'code';
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];
    if (state === 'line') {
      if (c === '\n') {
        state = 'code';
        out += c;
      }
    } else if (state === 'block') {
      if (c === '*' && next === '/') {
        state = 'code';
        i++;
      } else if (c === '\n') {
        out += c;
      }
    } else if (state === 'code') {
      if (c === '/' && next === '/') {
        state = 'line';
        i++;
      } else if (c === '/' && next === '*') {
        state = 'block';
        i++;
      } else {
        if (c === "'" || c === '"' || c === '`') state = c;
        out += c;
      }
    } else {
      out += c;
      if (c === '\\') {
        out += next ?? '';
        i++;
      } else if (c === state) {
        state = 'code';
      } else if (c === '\n' && state !== '`') {
        state = 'code';
      }
    }
  }
  return out;
}

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return listFiles(full);
    return /\.(ts|tsx|js|mjs|cjs)$/.test(name) ? [full] : [];
  });
}

const files = listFiles(target);
const findings = [];
for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const rawLines = raw.split(/\r?\n/); // Windows editors may save CRLF
  stripComments(raw)
    .split(/\r?\n/)
    .forEach((line, index) => {
      for (const { rule, pattern } of CHECKS) {
        if (pattern.test(line)) {
          const location = `${path.relative(ROOT, file).split(path.sep).join('/')}:${index + 1}`;
          findings.push(`${location}: ${rule}: ${rawLines[index].trim()}`);
        }
      }
    });
}

if (findings.length) {
  for (const finding of findings) console.log(finding);
  console.log(`\ncheck:rules FAIL: ${findings.length} violation${findings.length === 1 ? '' : 's'} in ${files.length} files`);
  process.exit(1);
}
console.log(`check:rules PASS: ${files.length} files, no violations`);
