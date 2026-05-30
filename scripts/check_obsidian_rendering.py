#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
required_files = [
    'realisations.html',
    'obsidian-lab.html',
    'assets/js/obsidian-renderer.js',
    'assets/css/obsidian-renderer.css',
    'assets/js/writeups-enhancer.js',
]
required_strings = {
    'realisations.html': [
        'assets/js/obsidian-renderer.js',
        'assets/css/obsidian-renderer.css',
        'assets/js/writeups-enhancer.js',
    ],
    'obsidian-lab.html': [
        'Obsidian Lab',
        'obsidian-lab-output',
        'window.ObsidianRenderer.render',
        'flowchart LR',
        '```python',
        '```bash',
    ],
    'assets/js/obsidian-renderer.js': [
        'window.ObsidianRenderer',
        'renderMermaid',
        'highlight',
        'obs-callout',
        'obs-code',
        'obs-media',
    ],
    'assets/css/obsidian-renderer.css': [
        '.obsidian-doc h1',
        '.obsidian-doc h2',
        '.obs-code',
        '.obs-mermaid-wrap',
        '.obs-table-wrap',
        '.obs-callout',
        '.obs-media',
    ],
}

errors = []
for rel in required_files:
    if not (ROOT / rel).exists():
        errors.append(f'Missing required file: {rel}')

for rel, needles in required_strings.items():
    path = ROOT / rel
    if not path.exists():
        continue
    text = path.read_text(encoding='utf-8', errors='ignore')
    for needle in needles:
        if needle not in text:
            errors.append(f'Missing `{needle}` in {rel}')

if errors:
    print('Obsidian rendering checks failed:')
    for err in errors:
        print('-', err)
    sys.exit(1)

print('Obsidian rendering checks passed.')
