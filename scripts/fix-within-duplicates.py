"""
fix-within-duplicates.py
------------------------
Removes duplicate questions within the same file+level by keeping only the first occurrence.
Also normalises "N × M = ___" to "N × M = ?" in tables-multiplication.

Usage:
    python scripts/fix-within-duplicates.py
    python scripts/fix-within-duplicates.py --category mesures
    python scripts/fix-within-duplicates.py --dry-run
"""
import json, glob, sys, os, re, argparse

sys.stdout.reconfigure(encoding='utf-8')

parser = argparse.ArgumentParser()
parser.add_argument('--category', help='Limit to one category')
parser.add_argument('--dry-run', action='store_true')
args = parser.parse_args()

pattern = f'src/content/exams/{args.category}/*.json' if args.category else 'src/content/exams/**/*.json'
files = sorted(glob.glob(pattern, recursive=True))

total_removed = 0

for f in files:
    with open(f, encoding='utf-8') as fh:
        d = json.load(fh)

    changed = False
    for level, ldata in d.get('levels', {}).items():
        qs = ldata.get('questions', [])
        seen = set()
        to_remove = []
        for i, q in enumerate(qs):
            p = q.get('prompt', '').strip()
            # Normalise tables-multiplication format
            p_norm = re.sub(r'=\s*___\s*$', '= ?', p)
            if p_norm != p:
                q['prompt'] = p_norm
                p = p_norm
                changed = True
            if p in seen:
                to_remove.append(i)
                if args.dry_run:
                    print(f'  [{os.path.basename(f)}][{level}] remove dup: "{p[:65]}"')
            else:
                seen.add(p)
        for i in reversed(to_remove):
            qs.pop(i)
            changed = True
            total_removed += 1

    if changed and not args.dry_run:
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(d, fh, ensure_ascii=False, indent=2)
        print(f'Fixed: {os.path.basename(f)}')

print(f'\nTotal questions {"would be " if args.dry_run else ""}removed: {total_removed}')
