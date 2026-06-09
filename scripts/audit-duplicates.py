"""
audit-duplicates.py
-------------------
Audits all exam JSON files for within-file and cross-file duplicate questions.

Usage:
    python scripts/audit-duplicates.py
    python scripts/audit-duplicates.py --category logique
    python scripts/audit-duplicates.py --cross-file
"""
import json, glob, sys, os, argparse
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

parser = argparse.ArgumentParser()
parser.add_argument('--category', help='Filter to one category (e.g. logique)')
parser.add_argument('--cross-file', action='store_true', help='Also show cross-file duplicates')
args = parser.parse_args()

pattern = f'src/content/exams/{args.category}/*.json' if args.category else 'src/content/exams/**/*.json'
files = sorted(glob.glob(pattern, recursive=True))

print(f'Files scanned: {len(files)}')

# --- Within-file duplicates ---
all_dups = []
total_q = 0
for f in files:
    with open(f, encoding='utf-8') as fh:
        d = json.load(fh)
    fname = os.path.basename(f)
    for level, ldata in d.get('levels', {}).items():
        qs = ldata.get('questions', [])
        total_q += len(qs)
        seen = defaultdict(list)
        for i, q in enumerate(qs):
            seen[q.get('prompt', '').strip()].append(i)
        for p, locs in seen.items():
            if len(locs) > 1:
                all_dups.append((fname, level, p, locs))

print(f'Total questions: {total_q}')
print(f'Within-file duplicate sets: {len(all_dups)}')

if all_dups:
    by_file = defaultdict(list)
    for fname, level, p, locs in all_dups:
        by_file[fname].append((level, p, locs))
    for fname in sorted(by_file):
        print(f'\n  {fname}:')
        for level, p, locs in by_file[fname]:
            print(f'    [{level}] "{p[:70]}" x{len(locs)}')

# --- Cross-file duplicates ---
if args.cross_file:
    print('\n--- Cross-file repeated prompts (same prompt in >1 file, len>25) ---')
    prompt_files = defaultdict(set)
    for f in files:
        with open(f, encoding='utf-8') as fh:
            d = json.load(fh)
        fname = os.path.basename(f)
        cat = fname.rsplit('-', 1)[0]
        for ldata in d.get('levels', {}).values():
            for q in ldata.get('questions', []):
                p = q.get('prompt', '').strip()
                if len(p) > 25:
                    prompt_files[p].add(fname)

    cross = [(p, fs) for p, fs in prompt_files.items() if len(fs) > 1]
    cross.sort(key=lambda x: -len(x[1]))
    print(f'Prompts shared across >1 file: {len(cross)}')
    for p, fs in cross[:30]:
        print(f'  ({len(fs)} files) "{p[:65]}"')
